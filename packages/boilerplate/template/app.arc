@app
default

@http
/hello
  method get
  src src/http/get

# @aws
# profile default
# region us-west-1
