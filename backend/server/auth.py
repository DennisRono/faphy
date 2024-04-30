from flask import Blueprint, jsonify, request, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from . import db
from .models import User

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({"message": "Preflight request successful"}), 200
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    cpassword = data.get('cpassword')

    if not email or not password or not cpassword:
        return jsonify({"message": "Email and passwords are required"}), 400

    # Check if the email is already registered
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400

    # Create a new user
    new_user = User(email=email, password=generate_password_hash(password))

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"message": "something wrong happened!"}), 500
    
    return {"message": 'hello'}

@auth.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({"message": "Preflight request successful"}), 200
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    
    # Check if the email is registered
    user = User.query.filter_by(email=email).first()
    if user:
        if check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.id)
            return make_response(jsonify({"access_token": access_token, "email": user.email}), 200)
        else:
            return jsonify({"message": "Incorrect password"}), 401
    else:
        return jsonify({"message": "User is not registered"}), 404

    return {"message": 'hello'}

@auth.route('/update_password', methods=['POST', 'OPTIONS'])
def update_password():
    if request.method == 'OPTIONS':
        return jsonify({"message": "Preflight request successful"}), 200

    data = request.get_json()
    email = data.get('email')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not email or not current_password or not new_password:
        return jsonify({"message": "Email, current password, and new password are required"}), 400
    
    # Check if the email is registered
    user = User.query.filter_by(email=email).first()
    if user:
        # Check if the provided current password matches the stored password hash
        if not check_password_hash(user.password, current_password):
            return jsonify({"message": "Incorrect current password"}), 401
        
        # Update the password
        user.password = generate_password_hash(new_password)

        try:
            # Commit the changes to the database
            db.session.commit()
            return jsonify({"message": "Password updated successfully"}), 200
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify({"message": "Something went wrong"}), 500
    else:
        return jsonify({"message": "User is not registered"}), 404

@auth.route('/delete_user', methods=['DELETE', 'OPTIONS'])
def delete_user():
    if request.method == 'OPTIONS':
        return jsonify({"message": "Preflight request successful"}), 200
    
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required"}), 400
    
    # Check if the email is registered
    user = User.query.filter_by(email=email).first()
    if user:
        try:
            # Delete the user from the database
            db.session.delete(user)
            db.session.commit()
            return jsonify({"message": "User deleted successfully"}), 200
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify({"message": "Something went wrong"}), 500
    else:
        return jsonify({"message": "User is not registered"}), 404