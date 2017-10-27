# REST Client for Node

REST Client for node allows you to send HTTP request following the standard [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html).

## Main Features
* Authentication support for:
    - Basic Auth
    - Digest Auth
    - SSL Client Certificates
* Environments and custom/global system variables support
    - Use custom/global variables in any place of request(_URL_, _Headers_, _Body_)
    - Support both __environment__ and __file__ custom variables
    - Auto completion and hover support for both environment and file custom variables
    - Go to definition and find all references support _ONLY_ for file custom variables
    - Provide system dynamic variables `{{$guid}}`, `{{$randomInt min max}}` and `{{$timestamp}}` 
    - Easily create/update/delete environments and custom variables in setting file
    - Support environment switch
* Proxy support
* Send SOAP requests, as well as snippet support to build SOAP envelope easily

## Usage

See `test` directory

#### Query Strings

You can always write query strings in the request line, like:
```http
GET https://example.com/comments?page=2&pageSize=10
```
Sometimes there may be several query parameters in a single request, putting all the query parameters in _Request Line_ is difficult to read and modify. So we allow you to spread query parameters into multiple lines(one line one query parameter), we will parse the lines in immediately after the _Request Line_ which starts with `?` and `&`, like
```http
GET https://example.com/comments
    ?page=2
    &pageSize=10
```

### Request Headers
The lines immediately after the _request line_ to first empty line are parsed as _Request Headers_. Please provide headers with the standard `field-name: field-value` format, each line represents one header. By default `REST Client Extension` will add a `User-Agent` header with value `vscode-restclient` in your request if you don't explicitly specify. You can also change the default value in setting `rest-client.defaultuseragent`.
Below are examples of _Request Headers_:
```http
User-Agent: rest-client
Accept-Language: en-GB,en-US;q=0.8,en;q=0.6,zh-CN;q=0.4
Content-Type: application/json
```

### Request Body
If you want to provide the request body, please add a blank line after the request headers like the POST example in usage, and all content after it will be treated as _Request Body_.
Below are examples of _Request Body_:

```http
POST https://example.com/comments HTTP/1.1
Content-Type: application/xml
Authorization: token xxx

<request>
    <name>sample</name>
    <time>Wed, 21 Oct 2015 18:27:50 GMT</time>
</request>
```

You can also specify file path to use as a body, which starts with `< `, the file path can be either in absolute or relative(relative to workspace root or current http file) formats:
```http
POST https://example.com/comments HTTP/1.1
Content-Type: application/xml
Authorization: token xxx

< C:\Users\Default\Desktop\demo.xml
```
```http
POST https://example.com/comments HTTP/1.1
Content-Type: application/xml
Authorization: token xxx

< ./demo.xml
```

When content type of request body is `multipart/form-data`, you may have the mixed format of the request body like following:
```http
POST https://api.example.com/user/upload
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="text"

title
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="image"; filename="1.png"
Content-Type: image/png

< ./1.png
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

> When your mouse is over the document link, you can `Ctrl+Click`(`Cmd+Click` for macOS) to open the file in a new tab.

## Making CURL Request
We add the capability to directly run [curl request](https://curl.haxx.se/) in REST Client extension. The issuing request command is the same as raw HTTP one. REST Client will automatically parse the request with specified parser.

`REST Client` doesn't fully support all the options of `cURL`, since underneath we use `request` library to send request which doesn't accept all the `cURL` options. Supported options are listed below:
* -X, --request
* -L, --location, --url
* -H, --header(no _@_ support)
* -b, --cookie(no cookie jar file support)
* -u, --user(Basic auth support only)
* -d, --data, --data-binary


## Authentication
We have supported some most common authentication schemes like _Basic Auth_, _Digest Auth_ and _SSL Client Certificates_.

### Basic Auth
HTTP Basic Auth is a widely used protocol for simple username/password authentication. We support __two__ formats of Authorization header to use Basic Auth.
1. Add the value of Authorization header in the base64 encoding of `username:password`.
2. Add the value of Authorization header in the raw value of `username` and `password`, which is separated by space.

The corresponding examples are as following:
```http
GET https://httpbin.org//basic-auth/user/passwd HTTP/1.1
Authorization: Basic dXNlcjpwYXNzd2Q=
```
and
```http
GET https://httpbin.org//basic-auth/user/passwd HTTP/1.1
Authorization: Basic user passwd
```

### Digest Auth
HTTP Digest Auth is also a username/password authentication protocol that aims to be slightly safer than Basic Auth. The format of Authorization header for Digest Auth is similar to Basic Auth. You just need to set the scheme to `Digest`, as well as the raw user name and password.
```http
GET https://httpbin.org/digest-auth/auth/user/passwd
Authorization: Digest user passwd
```

### SSL Client Certificates
We support `PFX`, `PKCS12`, and `PEM` certificates. Before using your certificates, you need to set the certificates paths(absolute/relative to current directory/relative to current http file) in the setting file for expected host name(port is optional). For each host, you can specify the key `cert`, `key`, `pfx` and `passphrase`.
- `cert`: Path of public x509 certificate
- `key`: Path of private key
- `pfx`: Path of PKCS #12 or PFX certificate
- `passphrase`: Optional passphrase for the certificate if required

## Variables
We support two types of variables, one is __Global System Variables__ which is a predefined set of variables out-of-box, another is __Custom Variables__ which is defined by user and can even be divided into __Environment Variables__ and __File Variables__.

The usage of these two types of variables also has a little difference, for the former the syntax is `{{$SystemVariableName}}`, while for the latter, no matter environment or file level custom variables, the syntax is `{{CustomVariableName}}`.

### Custom Variables
Custom variables belong to either the environment or file scope. The environment scope variables are mainly used for storing values that vary in different environments and keep unchanged in an specific environment. And environment variables are defined in vscode setting file which can be used across of different files. The file scope variables are mainly used for variables which are frequently updated variables and not so common across environments. And file variables are directly defined in `http` file, which can be update and share with others much easily.

For environment variables, each environment is a set of key value pairs defined in setting file, key is the variable name, while value is variable value. Only custom variables in selected environment are available to you. Current active environment name is displayed in the right bottom of `Visual Studio Code`, when you click it, you can switch environment, current active environment's name will be marked with a check sign in the end. And you can also switch environment using shortcut `Ctrl+Alt+E`(`Cmd+Alt+E` for macOS), or press `F1` and then select/type `Rest Client: Switch Environment`. When you write custom variables in `http` file, auto completion will be available to you, so if you have a variable named `host`, you don't need to type the full word `{{host}}` by yourself, simply type `host` or even less characters, it will prompt you the `host` variable as well as its actual value. After you select it, the value will be autocompleted with `{{host}}`. And if you hover on it, its value will also be displayed.

For file variables, each variable definition follows syntax __`@variableName = variableValue`__. And variable name __MUST NOT__ contains any spaces. As for variable value, it can be consist of any characters, even white spaces are allowed for them (Leading and trailing white spaces will be ignored). If you want to input some special character like line break, you can use the _backslash_ `\` to escapse, like `\n`. And variables can be defined in a common block of code which is also separated by `###`. You can also define them before any request url, which needs an extra blank line between variable definitions and request url. However, no matter where you define the variables in the `http` file, they can be referenced in any requests of the file. For file scope variables, you can also benefit from some `Visual Studio Code` features like _Go to definition_ and _Find All References_.

```http
@name = Huachao Mao
@id = 313
@address = Wuxi\nChina

###

@token = Bearer e975b15aa477ee440417ea069e8ef728a22933f0

GET https://example.com/api/comments/1 HTTP/1.1
Authorization: {{token}}

###

PUT https://example.com/api/comments/{{id}} HTTP/1.1
Authorization: {{token}}
Content-Type: application/json

{
    "name": "{{name}}",
    "address": "{{address}}"
}
```

> When same name variable defined in both environment and file scope, file scope variable has precedence over environment scope variable. That means the extension will use the variable value defined in `http` file.

### Global Variables
Global variables provide a pre-defined set of variables that can be used in any part of the request(Url/Headers/Body) in the format `{{$variableName}}`. Currently, we provide a few dynamic variables which you can use in your requests. The variable names are _case-sensitive_.
* `{{$guid}}`: Add a RFC 4122 v4 UUID
* `{{$randomInt min max}}`: Returns a random integer between min (included) and max (excluded)
* `{{$timestamp}}`: Add UTC timestamp of now. You can even specify any date time based on current time in the format `{{$timestamp number option}}`, e.g., to represent 3 hours ago, simply `{{$timestamp -3 h}}`; to represent the day after tomorrow, simply `{{$timestamp 2 d}}`. The option string you can specify in timestamp are:

Option | Description
------ | -----------
y | Year
Q | Quarter
M | Month
w | Week
d | Day
h | Hour
m | Minute
s | Second
ms | Millisecond

### Variables Sample:
```http
@token = Bearer fake token

POST https://{{host}}/comments HTTP/1.1
Content-Type: application/xml
X-Request-Id: {{token}}

{
    "request_id": "{{$guid}}",
    "updated_at": "{{$timestamp}}",
    "created_at": "{{$timestamp -1 d}}",
    "review_count": "{{$randomInt 5, 200}}"
}
```

## Settings
* `rest-client.followredirect`: Follow HTTP 3xx responses as redirects. (Default is __true__)
* `rest-client.defaultuseragent`: If User-Agent header is omitted in request header, this value will be added as user agent for each request. (Default is __vscode-restclient__)
* `rest-client.timeoutinmilliseconds`: Timeout in milliseconds. 0 for infinity. (Default is __0__)
* `rest-client.showResponseInDifferentTab`: Show response in different tab. (Default is __false__)
* `rest-client.enableTelemetry`: Send out anonymous usage data. (Default is __true__)
* `rest-client.excludeHostsForProxy`: Excluded hosts when using proxy settings. (Default is __[]__)
* `rest-client.environmentVariables`: Sets the environments and custom variables belongs to it (e.g., `{"production": {"host": "api.example.com"}, "sandbox":{"host":"sandbox.api.example.com"}}`). (Default is __{}__)
* `rest-client.mimeAndFileExtensionMapping`: Sets the custom mapping of mime type and file extension of saved response body. (Default is __{}__)
* `rest-client.certificates`: Certificate paths for different hosts. The path can be absolute path or relative path(relative to workspace or current http file). (Default is __{}__)
* `rest-client.useTrunkedTransferEncodingForSendingFileContent`: Use trunked transfer encoding for sending file content as request body. (Default is __true__)
* `rest-client.suppressResponseBodyContentTypeValidationWarning`: Suppress response body content type validation. (Default is __false__)

Rest Client respects the proxy settings made for Visual Studio Code (`http.proxy` and `http.proxyStrictSSL`).

## License
[MIT License](LICENSE)

## Change Log
See CHANGELOG [here](CHANGELOG.md)

## Special Thanks 
to [Huachao Map](https://github.com/Huachao) and all the amazing [contributors](https://github.com/Huachao/vscode-restclient/graphs/contributors)❤️

## Feedback
Please provide feedback through the [GitHub Issue](https://github.com/lionellvillard/vscode-restclient/issues) system, or fork the repository and submit PR.
