
# Important

You must add 2 files
&nbsp;&nbsp;&nbsp;&nbsp;**cloudinary.js** 
and
&nbsp;&nbsp;&nbsp;&nbsp; **database.js** 
to 
&nbsp;&nbsp;&nbsp;&nbsp;**common/constant/**
 if you don't - the app will not work.

| ___common/

&nbsp;&nbsp;&nbsp;&nbsp;| ___constant/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| ___**cloudinary.js**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| ___**database.js**


**cloundynary.js**

    module.exports  = {
	    cloud_name:  'your_cloundynary_cloud_name',
	    api_key:  'your_cloundynary_api_key',
	    api_secret:  'your_cloundynary_api_secret'
    }

**database.js**

    module.exports  = {
	    URL: {    	
		    RELEASE:'your_url_to_mongodb',
		    DEV:  'your_url_to_mongodb'
	    },
	    NAME:  'xcdc',
		COLLECTIONS: {
		    GUEST:  "guests",
		    ACCOUNT:  "accounts",
		    MEETING:  "meetings"
	    }
	}
   
and then  run:

       $ npm i 

finally:

       $ npm start 
