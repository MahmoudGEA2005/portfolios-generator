from flask import Flask, request, render_template, jsonify, make_response, send_from_directory
from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
import uuid
import bcrypt
from flask_jwt_extended import (create_access_token, set_access_cookies, JWTManager, jwt_required, get_jwt_identity, unset_jwt_cookies)
from datetime import timedelta
import os
from werkzeug.utils import secure_filename
from flask_migrate import Migrate
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.mutable import MutableList 
from PIL import Image



app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')



# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://neondb_owner:npg_pv9e8WXYMrRk@ep-sweet-queen-a2whfnhf-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# CORS(app, supports_credentials=True)
db = SQLAlchemy(app)
migrate = Migrate(app, db)


# JWT
app.config["SECRET_KEY"] = 'klhvhjvkjkjbvhjhkjhgg3hj4j2g42hj4jh4j'
app.config['JWT_SECRET_KEY'] = 'kghjhg35jhg5hj3g5hj3ghjg3hjg43hjg43hjg43hjghjghjghjg'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Optional, if you are not using CSRF protection



jwt = JWTManager(app)


MAX_IMAGE_SIZE = (800, 800)
QUALITY = 85


def compress_image(image_path, output_path):
    img = Image.open(image_path)

    if img.mode == 'RGBA':
        img = img.convert('RGB')

    img.thumbnail(MAX_IMAGE_SIZE)

    img.save(output_path, format='JPEG', quality=QUALITY, optimize=True)



class User(db.Model):
    
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fname = db.Column(db.String(100), nullable=False)
    lname = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.String, nullable=False)
    admin = db.Column(db.Boolean, default=False)

    def __init__(self, fname, lname, username, email, password, user_id):
        self.fname = fname
        self.lname = lname
        self.username = username
        self.email = email
        self.password = password
        self.user_id = user_id

class UsersPortfolios(db.Model):
    __tablename__ = "usersportfolios"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String, nullable=False)
    users_templates = db.Column(MutableList.as_mutable(ARRAY(db.Integer)))

    def __init__(self, user_id, users_templates):
        self.user_id = user_id
        self.users_templates = users_templates

class Design1(db.Model):
    __tablename__ = 'design1'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    job_title = db.Column(db.String(100), nullable=False)
    job_title_logo = db.Column(db.String(100), nullable=False)
    cv_link = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    about = db.Column(db.String(10000), nullable=False)
    card1title = db.Column(db.String(100), nullable=False)
    card1info = db.Column(db.String(100), nullable=False)
    card2title = db.Column(db.String(100), nullable=False)
    card2info = db.Column(db.String(100), nullable=False)
    aboutlinkonelabel = db.Column(db.String(100), nullable=False)
    aboutlinkone = db.Column(db.String(100), nullable=False)
    aboutlinktwolabel = db.Column(db.String(100), nullable=False)
    aboutlinktwo = db.Column(db.String(100), nullable=False)
    github = db.Column(db.String(100), nullable=False)
    youtube = db.Column(db.String(100), nullable=False)
    linkedin = db.Column(db.String(100), nullable=False)
    picture = db.Column(db.String(300), nullable=False)

    def __init__(self, user_id, name, job_title, job_title_logo, cv_link, email, about, card1title, card1info, card2title, card2info, aboutlinkonelabel, aboutlinkone, aboutlinktwolabel, aboutlinktwo, github, youtube, linkedin, picture):
        self.user_id = user_id
        self.name = name
        self.job_title = job_title
        self.job_title_logo = job_title_logo
        self.cv_link = cv_link
        self.email = email
        self.about = about
        self.card1title = card1title
        self.card1info = card1info
        self.card2title = card2title
        self.card2info = card2info
        self.aboutlinkonelabel = aboutlinkonelabel
        self.aboutlinkone = aboutlinkone
        self.aboutlinktwolabel = aboutlinktwolabel
        self.aboutlinktwo = aboutlinktwo
        self.github = github
        self.youtube = youtube
        self.linkedin = linkedin
        self.picture = picture



with app.app_context():
    db.create_all()


@app.route("/", methods=["GET"])
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/register', methods=['POST'])
def register():
    response = [{"state": "errors"}]
    fname = request.form.get('fname')
    lname = request.form.get('lname')
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    cpassword = request.form.get('cpassword')

    if request.form.get("terms") == "false":
        response.append({"is_error": True,"message": "You have to agree to the terms and conditions", "error_type": "terms", "error_code": 409})

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        response.append({"is_error": True, "message": "Username is already taken", "error_type": "username_found", "error_code": 409})

    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        response.append({"is_error": True,"message": "You already have an account with this email", "error_type": "email_found", "error_code": 409})

    if password != cpassword:
        response.append({"is_error": True, "message": "Passwords are not matching", "error_type": "password_match", "error_code": 409})


    if len(response) > 1:
        return jsonify(response)

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    user_id = str(uuid.uuid4())
    aUser = User(fname=fname, lname=lname, username=username, email=email, password=hashed_password.decode('utf-8'), user_id=user_id)
    templates = UsersPortfolios(user_id=user_id, users_templates=[])
    db.session.add(aUser)
    db.session.add(templates)
    db.session.commit()

    access_token = create_access_token(identity=user_id)

    response = jsonify({"message": "User registered successfully"})
    set_access_cookies(response, access_token)
    
    # response.set_cookie(
    #     'access_token_cookie', 
    #     access_token, 
    #     max_age=86400, 
    #     secure=True,  # Set this to True when using HTTPS
    #     samesite='None'  # Allow cross-site requests (needed for cross-origin)
    # )

    return response

@app.route("/api/login", methods=["POST"])
def login():
    response = [{"state": "errors"}]
    email = request.form.get("email")
    password = request.form.get("password")

    if not email:
        response.append({"is_error": True, "message": "Email can't be empty", "error_type": "empty_email", "error_code": 409})
    if not password:
        response.append({"is_error": True, "message": "Password can't be empty", "error_type": "empty_password", "error_code": 409})

    if len(response) > 1:
        return jsonify(response)

    user = User.query.filter_by(email=email).first()
    if user:
        is_password_correct = bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8'))
        if is_password_correct:
            access_token = create_access_token(identity=user.user_id)
            response = jsonify({"message": "Logged in successfully"})
            set_access_cookies(response, access_token)

            # response.set_cookie(
            #     'access_token_cookie', 
            #     access_token, 
            #     max_age=86400, 
            #     secure=True,  # Set this to True when using HTTPS
            #     samesite='None',  # Allow cross-site requests (needed for cross-origin)
            #     # domain='https://nameless-oasis-38481-2bd1b8ebfc5e.herokuapp.com/',
            #     httponly=True
            # )

            return response
        else:
            response.append({"is_error": True, "message": "The password is incorrect", "error_type": "incorrect_password", "error_code": 409})
    else:
        response.append({"is_error": True, "message": "The user doesn't exist", "error_type": "not_user", "error_code": 404})
    if len(response) > 1:
        return response
    return jsonify({"segma": "h"})

@app.route("/api/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logged Out"})
    response.set_cookie(
                    'access_token_cookie', 
                    ''
                )
    return response

@app.route("/api/create", methods=["POST"])
@jwt_required()
def create():
    design_id = int(request.form.get("design_id"))
    if design_id == 1:
        name = request.form.get("name")
        job_title = request.form.get("job_title")
        job_title_logo = request.form.get("job_title_logo")
        cv_link = request.form.get("cv_link")
        email = request.form.get("email")
        about = request.form.get("about")
        card1title = request.form.get("card1title")
        card1info = request.form.get("card1info")
        card2title = request.form.get("card2title")
        card2info = request.form.get("card2info")
        aboutlinkonelabel = request.form.get("aboutlinkonelabel")
        aboutlinkone = request.form.get("aboutlinkone")
        aboutlinktwolabel = request.form.get("aboutlinktwolabel")
        aboutlinktwo = request.form.get("aboutlinktwo")
        github = request.form.get("github")
        youtube = request.form.get("youtube")
        linkedin = request.form.get("linkedin")
        user_id = get_jwt_identity()
        picture = None
        if 'picture' in request.files:
            picture_file = request.files['picture']
            if picture_file and picture_file.filename != '':
                root_picture_filename = secure_filename(picture_file.filename)
                picture_filename = f"{uuid.uuid4().hex}_{root_picture_filename}"
                picture_path = os.path.join('static', 'imgUploads', picture_filename)

                temp_path = os.path.join('static', 'imgUploads', f"temp_{picture_filename}")
                picture_file.save(temp_path)

                compress_image(temp_path, picture_path)

                os.remove(temp_path)

                picture = picture_path
                
        portfolio = Design1(user_id=user_id, name=name, job_title=job_title, job_title_logo=job_title_logo, cv_link=cv_link, email=email, about=about, card1title=card1title, card1info=card1info, card2title=card2title, card2info=card2info, aboutlinkonelabel=aboutlinkonelabel, aboutlinkone=aboutlinkone, aboutlinktwolabel=aboutlinktwolabel, aboutlinktwo=aboutlinktwo, github=github, youtube=youtube, linkedin=linkedin, picture=picture)
        users_ports = UsersPortfolios.query.filter_by(user_id=user_id).first()
        if users_ports:
            users_ports.users_templates.append(1)
        db.session.add(portfolio)
        db.session.commit()
    return jsonify({"message": "request receievd"})

@app.route("/api//update", methods=["POST"])
@jwt_required()
def update():
    user_id = get_jwt_identity()
    req = request.form
    escape = ["design_id", "picture", "request"]
    if req.get("request") == "design1":
        design_data = Design1.query.filter_by(user_id=user_id).first();
        design_data_dict = {key: value for key, value in design_data.__dict__.items() if not key.startswith("_")}
        rec_data = req.items()
        updated_values = {}
        if "picture" in request.files:
            old_img = Design1.query.filter_by(user_id=user_id).first().picture
            picture = None
            picture_file = request.files['picture']
            if picture_file and picture_file.filename != '':
                root_picture_filename = secure_filename(picture_file.filename)
                picture_filename = f"{uuid.uuid4().hex}_{root_picture_filename}"
                picture_path = os.path.join('static', 'imgUploads', picture_filename)
                picture_file.save(picture_path)
                if old_img and os.path.exists(old_img):
                    print(old_img)
                    os.remove(old_img)                
                picture = picture_path
                updated_values["picture"] = picture
        for key, value in rec_data:
            if key not in escape:
                if value != design_data_dict[key]:
                    updated_values[key] = value
        if updated_values:
            Design1.query.filter_by(user_id=user_id).update(updated_values)
        db.session.commit()
    elif req.get("request") == "change_user_data":
        updated_values = {}
        for key, value in req.items():
            if key not in escape:
                updated_values[key] = value
        User.query.filter_by(user_id=user_id).update(updated_values)
        db.session.commit()
    return jsonify("hello")

@app.route("/api/data", methods=["POST"])
@jwt_required()
def data():
    user_id = get_jwt_identity()
    portfolio_data = Design1.query.filter_by(user_id=user_id).first();
    data_dict = {key: value for key, value in portfolio_data.__dict__.items() if not key.startswith("_")}
    if 'picture' in data_dict:
        data_dict['picture'] = data_dict['picture'].replace("\\", "/")
    return jsonify({"data": data_dict})

@app.route("/api/fetcher", methods=["POST"])
@jwt_required()
def fetcher():
    user_id = get_jwt_identity()
    user = User.query.filter_by(user_id=user_id).first()
    req = request.get_json("req")
    if (user):
        if req["req"] == "username":
            return jsonify({"fname": user.fname})
        if req["req"] == "user_data":
            user_dict = {key: value for key, value in user.__dict__.items() if not key.startswith("_")}
            return jsonify(user_dict)
        elif req["req"] == "users_ports":
            users_ports = UsersPortfolios.query.filter_by(user_id=user_id).first()
            if users_ports:
                return jsonify({"users_ports": users_ports.users_templates})
        return jsonify({"message": "failed to fetch"})
    else:
        return jsonify({"username": "faild"})

@app.route("/api/admin", methods=["POST"])
@jwt_required()
def admin():
    req = request.get_json()
    if req["req"] == "users_data":
        print("debug")
        users = User.query.all()
        users_lst = []
        for user in users:
            users_lst.append({key: value for key, value in user.__dict__.items() if not key.startswith("_")})
        return jsonify({"users": users_lst})
    elif req["req"] == "delete_user":
        user_id = request.get_json("user_id")["user_id"]
        if user_id:
            target_user = User.query.filter_by(user_id=user_id).first()
            db.session.delete(target_user)
            db.session.commit()
        return jsonify({"m": "n"})
    elif req["req"] == "change_permission":
        User.query.filter_by(user_id=req["user_id"]).update({"admin": req["permission"]})
        db.session.commit()
        return jsonify({"m": "Permission has been chnged"})

    return jsonify({"error": "Null"})

    


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)