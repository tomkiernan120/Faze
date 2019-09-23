# Faze

[![BrowserStack](https://github.com/tomkiernan120/Faze/blob/master/Browserstack-logo%402x.png)](https://www.browserstack.com/)

Happy to be sponsored by browserstack, we used browserstack to test the Faze framework on multiple machines and multiple browsers making sure faze is cross compatible. We are also looking to use Browserstacks powerful automation testing tools.

## Contributors wanted!!!

Actively looking for contributors, really want to make this a helpful and learning experience, please help improve this documentation and code, and really make it clear to possible new comers what we are updating and why. So new contributors can really improve their open source skills and also confidence. Thanks!

Faze is a javascript helper framework much like others out there, although this aims to be a learning tool as well as lightweight and helpful set of javascript APIs

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for extra information about development.

### Prerequisites

You will need to clone this repository and also need a current copy of Node, NPM and also be able to use things like webpack

```
git clone https://github.com/tomkiernan120/Faze
```

### Installing

A step by step series of examples that tell you how to get a development env running

Firstly go to the Faze directory.

```
cd Faze
```

Then install all node dependencies

```
npm install
```

Finally call build to compile the javascript and build distribution

```
npm run build
```

This will also watch for any changes to the src file.


Lastly include the dist/faze.min.js file that is being output by webpack in a webpage and use the functions.

Alternatively you can use the test/index.html to check the unit tests.

## Running the tests ( Looking for contributors/testers )

There is currenlty only unit tests set up for this system, but looking for contributors to help introduce better and more extensive testing.


## Built With

* [Webpack](https://webpack.js.org/) - Build Tool

## Contributing

Please read [CONTRIBUTING.md](https://github.com/tomkiernan120/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Tom Kiernan** - *Initial work* - [tomkiernan120](https://github.com/tomkiernan120)

See also the list of [contributors](https://github.com/tomkiernan120/faze/contributors) who participated in this project.

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE - see the [LICENSE.md](LICENSE.md) file for details
