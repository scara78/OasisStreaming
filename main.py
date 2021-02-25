#Made by Dread Pirate Roberts
#Copyright 2020

#Imports
import json
import urllib.request
import urllib.parse
from flask import Flask,render_template,request

#Variables
app = Flask(__name__,template_folder="static")

#Functions
def searchmovies(searchq):
	req = urllib.request.Request("https://lookmovie.io/api/v1/movies/search/?q={}".format(urllib.parse.quote_plus(searchq)))
	req.add_header("User-Agent","Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0")
	resraw = urllib.request.urlopen(req).read().decode("utf-8")
	res = json.loads(resraw)
	return res

def getinfo(movie):
	req = urllib.request.Request("https://lookmovie.io/movies/view/{}".format(movie))
	req.add_header("User-Agent","Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0")
	resraw = urllib.request.urlopen(req).read().decode("utf-8")
	title = resraw.split("title: '")[1].split("',")[0]
	year = resraw.split("year: '")[1].split("',")[0]
	desc = resraw.split("<p class=\"description\">")[1].split("<span class=\"less\">less</span>")[0].strip()
	searchr = searchmovies(title)
	mdata = None
	for result in searchr["result"]:
		if result["slug"] == movie:
			mdata = result
	return {
		"title": title,
		"year": year,
		"desc": desc,
		"released": mdata["release_date"],
		"slug": movie
	}

#Flask routes
@app.route("/")
def index():
	return render_template("index.html")

@app.route("/faq")
def faq():
	return render_template("faq.html")

@app.route("/privacy")
def privacy():
	return render_template("privacy.html")

@app.route("/results")
def results():
	res = searchmovies(request.args.get("s"))
	return render_template("results.html",query=request.args.get("s"),results=res["result"])

@app.route("/watch/<movie>")
def watch(movie):
	return render_template("watch.html",moviedata=getinfo(movie))

#Main
if __name__ == "__main__":
	app.run()