from flask import Flask, request,jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import datetime as dt
import google.generativeai as genai
from dotenv import load_dotenv
import os
import re
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://examapp_postgres_user:9pU98DVQDE1J4ICu1s9gig3MypeVDZJb@dpg-cvhonlogph6c73cducq0-a.singapore-postgres.render.com/examapp_postgres'
db = SQLAlchemy(app)
CORS(app)




#Registering of teacher and Student -----------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------- -----------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------- -----------------------------------------------------------------------------------------

#Works
@app.route('/signin/teacher',methods=['POST'])
def signin_teacher():
    try:
        body = request.json
        email = body['email']
        passw = body['pass']
        with db.engine.connect() as connection:
            query = text("Select * from teachers where email = :email and pass = :passw")
            result = connection.execute(query,{
                "email":email,
                "passw":passw
            }).fetchone()

            if(result):
                return jsonify({'signin':True})
            else:
                return jsonify({'signin':False})
    except Exception as e:
        return jsonify({'Message':f"{e}"})

@app.route('/signin/student',methods=['POST'])
def signin_student():
    try:
        body = request.json
        email = body['email']
        passw = body['pass']
        with db.engine.connect() as connection:
            query = text("Select * from students where email = :email and password = :passw")
            print(query,email,passw)
            result = connection.execute(query,{
                "email":email,
                "passw":passw
            }).fetchone()

            if(result):
                return jsonify({'signin':True})
            else:
                return jsonify({'signin':False})
    except Exception as e:
        return jsonify({'Message':f"{e}"})

@app.route('/signup/teacher',methods=['POST'])
def signup_teacher():
    try:
        body = request.json
        name = body['name']
        phone = body['phone']
        email = body['email']
        passw = body['pass']
        with db.engine.connect() as connec:
            query = text('INSERT INTO Teachers (Name, Email, PhoneNumber, Pass) VALUES (:name, :email, :phone, :passw);')
            connec.execute(query,{
                "name":name,
                "email":email,
                "phone":int(phone),
                "passw":passw
            })
            connec.commit()
            return jsonify({'Message':"Success"})
    except Exception as e:
        return jsonify({'Message':f"{e}"})

@app.route('/signup/student',methods=['POST'])
def signup_student():
    try:
        body = request.json
        name = body['name']
        regno = body['regno']
        email = body['email']
        passw = body['pass']
        imgurl = body['imgurl']
        with db.engine.connect() as connec:
            query = text('INSERT INTO Teachers (name, email, password, regno, imgurl) VALUES (:name, :email, :passw, :regno, :imgurl);')
            connec.execute(query,{
                "name":name,
                "email":email,
                "regno":regno,
                "passw":passw,
                "imgurl":imgurl
            })
            connec.commit()
            return jsonify({'Message':"Success"})
    except Exception as e:
        return jsonify({'Message':f"{e}"})


#Question Related  -------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/questionmake',methods=['POST'])
def questionmake():
    try:
        body = request.json
        topicname = body['topicname'].lower()
        questiontext = body['questiontext'].lower()
        diff = body['diff'].lower()
        options = body['options'].lower()
        correct = body['correctans']
        with db.engine.connect() as connec:
            query = text('INSERT INTO Teachers (topicname, questiontext, difficulty, options, correctanswer) VALUES (:topicname, :questiontext, :diff, :options, :correct);')
            connec.execute(query,{
                "topicname":topicname,
                "questiontext":questiontext,
                "diff":diff,
                "options":options,
                "correct":correct
            })
            connec.commit()
            return jsonify({'Message':"Success"})
    except Exception as e:
        return jsonify({'Message':f"{e}"})

#Works -> Array with Array of questionid and test -> Ensure to have diff as empty string if not available
@app.route('/questionshow', methods=['POST'])
def questionshow():
    try:
        body = request.json
        topicname = body['topicname'].lower()
        diff = body['diff'].lower()
        texts = "Select questionid, questiontext from questions where"
        flag = False
        retval = []

        #Diffitcults rating if present
        if diff != "":
            texts+=f" difficulty={diff} "
            flag = True
        
        if(flag):
            texts+= f"and topicname like '%{topicname[0].lower()}%'"
        else:
            texts+= f" topicname like '%{topicname[0].lower()}%'"
        
        #Topic name
        for i in range(1,len(topicname)):
            texts+=f" and topicname like '%{topicname[i].lower()}%'"
        
        print(texts)

        with db.engine.connect() as connec:
            query = text(f"{texts}")
            result = connec.execute(query).fetchall()
            for i in result:
                retval.append([i[0],i[1]])
            connec.commit()
            return jsonify({'Message':f"{retval}"})
    except Exception as e:
        return jsonify({'Message':f"{e}"})
    
#Works -> Output is an array of unique topics
@app.route('/topicsavail',methods=['GET'])
def topicsavail():
    try:
        topicsret = set()
        finalret = []
        with db.engine.connect() as connec:
            query = text(f"Select DISTINCT topicname from questions")
            ans = connec.execute(query).fetchall()
            for i in ans:
                splits = i[0].split(',')
                j = splits[0]
                if j not in topicsret:
                    topicsret.add(j)
                
            for ab in topicsret:
                ab = ab.strip()
                finalret.append(ab)

            connec.commit()
            return jsonify({'Message':finalret})
    except Exception as e:
        return jsonify({'Message':f"{e}"})
    
#Test Related -------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#works -> Return of true or false for success or failure to create a test
@app.route('/createtest', methods = ['POST'])
def test():
    try:
        body = request.json
        teachid = body['teacherid']
        classcode = body['classcode']
        questionarr = body['questionarr']
        testtime = body['timestamp']
        with db.engine.connect() as connec:
            query = text(f"Insert into test(teacherid, classroomcode, questions, testtime) values ({teachid}, {classcode}, '{questionarr}', '{testtime}')")
            print(query)
            connec.execute(query)
            connec.commit()
            return jsonify({'Message':True})
    except Exception as e:
        print("we came to exception end")
        return jsonify({'Message':f"{e}"})

#Sends the array of questionstext , difficulty level, options and ans idx -> For the test
@app.route('/questionstotest',methods = ['POST'])
def questionstotest():
    try:
        questions = []
        body = request.json
        testid = body['testid']
        with db.engine.connect() as connec:
            query = text(f"Select questions from test where testid={testid}")
            result = connec.execute(query).fetchone()[0]
            print("result is ",result)
            for i in result:
                query = text(f"Select questiontext, difficulty, options, correctanswer from questions where questionid={i}")
                newres = connec.execute(query).fetchone()
                newadd = []
                for i in newres:
                    newadd.append(i)
                connec.commit()
                questions.append(newadd)
            return jsonify({'Message':questions})
    except Exception as e:
        return jsonify({'Message':f"{e}"})

#Works -> To update test results
@app.route('/testresupdate',methods=['POST'])
def scoreupdation():
    try:
        body = request.json
        reg = body['regno']
        testid = body['testid']
        answer = body['answergiven']
        score = body['score']
        time = body['timetakentofinish'] 

        with db.engine.connect() as connec:
            query = text(f"insert into studenttest(regno, testid, score, timetakentofinish, answergiven) values ('{reg}', {testid},{score}, '{time}', '{answer}')")
            print(query)
            connec.execute(query)
            connec.commit()
            return jsonify({'Message':"Success"})
    except Exception as e:
        return jsonify({'Message':f"{e}"})


# Class Related -------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#To create a new class
@app.route('/createclass',methods=['POST'])
def createclass():
    try:
        body = request.json
        teacherid = body['teacherid']
        with db.engine.connect() as connec:
            query = text(f"insert into class (teacherid) values ({teacherid})")
            connec.execute(query)
            connec.commit()
            return jsonify({'Message':"Success"})
    except Exception as e:
        return jsonify({'Message':f"{e}"})

#For student to join a class
@app.route('/joinclass',methods=['POST'])
def joinclass():
    try:
        body = request.json
        classcode = body['classcode']
        regno = body['regno']

        with db.engine.connect() as connec:
            query = text(f"Select teacherid from class where classroomcode={classcode}")
            ans = connec.execute(query).fetchone()
            if ans:
                teacherid = ans[0]
                query = text(f"insert into studteach (teacherid, regno, classroomcode) values ({teacherid}, {regno}, {classcode})")
                connec.execute(query)
                connec.commit()
            return jsonify({'Message':"Success"})
    except Exception as e:
        return jsonify({'Message':f"{e}"})

#Display classes
@app.route('/showclassstud',methods=['POST'])
def showclassstud():
    try:
        body = request.json
        regno = body['regno']
        retval = []
        with db.engine.connect() as connec:
            query = text(f"Select * from class where regno={regno}")
            ans = connec.execute(query).fetchall()
            for i in ans:
                retval.append(i)
            return jsonify({'Message':retval})
    except Exception as e:
        return jsonify({'Message':f"{e}"})

# Class Related -------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# @app.route('/verifypic',methods=['POST'])
# def verifypic():
#     try:
#         file = request.files["image"]
#         img = Image.open(io.BytesIO(file.read())).resize((224, 224))  # Resize image
#         img_array = np.array(img) / 255.0  # Normalize
#         img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        
#         prediction = model.predict(img_array)
#         print()
#     except Exception as e:
#         return jsonify({'Message':f"{e}"})

# @app.route('/proctoring',methods=['POST'])
# def proctoring():

if __name__ == "__main__":
    app.run(debug=True)


