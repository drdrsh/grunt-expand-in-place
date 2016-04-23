# grunt-expand-in-place [![Build Status](https://travis-ci.org/drdrsh/grunt-expand-in-place.svg?branch=master)](https://travis-ci.org/drdrsh/grunt-expand-in-place)

This simple task expands an HTML comment block section into CSS and Javascript imports so something like this:
```html
	<!-- expand_section ["assets/app/js/**/*.js"] -->
	<!-- /expand_section -->
```
Becomes:
```html
	<!-- expand_section ["assets/app/js/**/*.js"] -->
	<script type="text/javascript" src="./assets/app/js/form/core/js1.js"></script>
	<script type="text/javascript" src="./assets/app/js/form/core/js2.js"></script>
	<script type="text/javascript" src="./assets/app/js/form/core/js3.js"></script>
	<script type="text/javascript" src="./assets/app/js/form/types/js4.js"></script>
	<!-- /expand_section -->
```
Please note that the task doesn't remove the comment section heading and that **it modifies the target HTML file in place**.

My motivation for this was that I usually work on my HTML files directly and not a "template" so I wanted a tool to handle importing JS and CSS into my development HTML file directly.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-expand-in-place --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-expand-in-place');
```

## The "expand-in-place" task
### Overview
In your project's Gruntfile, add a section named `expand-in-place` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'expand-in-place': {
    your_target: {
      target: ['path/to/my/files/**/*.html']
    }
  }
});
```

### Options

#### options.target
Type: `Array`

An array that contains the glob patterns for the files to process


### Usage Examples

#### Sample Options
In this example,

```js
grunt.initConfig({
  'expand-in-place': {
    dev: {
      target: ['my/files/*.html']
    }
  }
});
```

HTML Code:

```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>Simple title</title>
  <!-- expand_section ["assets/app/css/*.css", "assets/app/css/directory/*.css"] -->
	<!-- /expand_section -->
</head>
<body>
  <p>Some text</p>
	<!-- expand_section ["assets/app/tmpl/**/*.tmpl"] -->
	<!-- /expand_section -->

  <p>Some text</p>

	<!-- expand_section ["assets/app/js/**/*.js"] -->
	<!-- /expand_section -->
</body>
</html>
```

## Contributing
1. We're going with [airbnb's Style-guides](https://github.com/airbnb/javascript/).
1. Add unit tests for any new or changed functionality.
1. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
12/03/2016 0.1.0 Initial release
22/04/2016 0.2.0 Fixed engine version requirement and coding style
