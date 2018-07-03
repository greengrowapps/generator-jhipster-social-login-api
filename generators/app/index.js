const chalk = require('chalk');
const packagejs = require('../../package.json');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = class extends BaseGenerator {
    get initializing() {
        return {
            init(args) {
                if (args === 'default') {
                    // do something when argument is 'default'
                }
            },
            readConfig() {
                this.jhipsterAppConfig = this.getJhipsterAppConfig();
                if (!this.jhipsterAppConfig) {
                    this.error('Can\'t read .yo-rc.json');
                }
            },
            displayLogo() {
                // it's here to show that you can use functions from generator-jhipster
                // this function is in: generator-jhipster/generators/generator-base.js
                this.printJHipsterLogo();

                // Have Yeoman greet the user.
                this.log(`\nWelcome to the ${chalk.bold.yellow('JHipster social-login-api')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
            },
            checkJhipster() {
                const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
                const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
                if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
                    this.warning(`\nYour generated project used an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
                }
            }
        };
    }

    prompting() {
        const prompts = [
        ];

        const done = this.async();
        this.prompt(prompts).then((props) => {
            this.props = props;
            // To access props later use this.props.someOption;

            done();
        });
    }

    writing() {
        // function to use directly template
        this.template = function (source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;
        this.authenticationType = this.jhipsterAppConfig.authenticationType;
        this.applicationType = this.jhipsterAppConfig.applicationType;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // use constants from generator-constants.js
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;

        if (this.applicationType !== 'monolith' || this.authenticationType !== 'jwt') {
            this.error('This generator is only for Monolith apps with JWT authentication');
        }

        if (this.buildTool === 'maven') {
            this.addMavenDependency('dependency', 'com.google.api-client:google-api-client', '1.23.0', '');
            this.addMavenDependency('dependency', 'com.facebook.business.sdk:facebook-java-business-sdk', '3.0.0', '');
        } else if (this.buildTool === 'gradle') {
            this.addGradleDependency('compile', 'com.google.api-client:google-api-client', '1.23.0', '');
            this.addGradleDependency('compile', 'com.facebook.business.sdk:facebook-java-business-sdk', '3.0.0', '');
        } else {
            this.error(`Not supported build tool ${this.buildTool}`);
        }

        const templateFiles = [
            ['ApiSocialController.java', `${javaDir}/web/rest/ApiSocialController.java`],
            ['googlecredentials.json', `${resourceDir}/googlecredentials.json`],
        ];

        templateFiles.forEach(([src, dest = src]) => {
            this.fs.copyTpl(
                `${this.sourceRoot()}/${src}`,
                `${dest}`,
                { packageName: this.packageName }
            );
        });

        /* Add calls to permit all */

        const permitSocialCalls =
            '.authorizeRequests()\n' +
            '            .antMatchers("/api/authenticate/appGoogle").permitAll()\n' +
            '            .antMatchers("/api/authenticate/appFacebook").permitAll()';

        this.fs.copy(
            `${javaDir}/config/SecurityConfiguration.java`,
            `${javaDir}/config/SecurityConfiguration.java`,
            {
                process(content) {
                    const regEx = new RegExp('.authorizeRequests\\(\\)', 'g');
                    return content.toString().replace(regEx, permitSocialCalls);
                }
            }
        );

        /* Add extra method in UsersService */
        const findUserByEmail = '    @Transactional(readOnly = true)\n' +
            '    public Optional<User> getUserWithAuthoritiesByEmail(String email) {\n' +
            '        return userRepository.findOneWithAuthoritiesByEmail(email);\n' +
            '    }\n' +
            '}';

        this.fs.copy(
            `${javaDir}/service/UserService.java`,
            `${javaDir}/service/UserService.java`,
            {
                process(content) {
                    const regEx = new RegExp('(}[^}]*)$', '');
                    return content.toString().replace(regEx, findUserByEmail);
                }
            }
        );
    }

    install() {
        let logMsg =
            `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        if (this.clientFramework === 'angular1') {
            logMsg =
                `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
        }
        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            } else if (this.clientFramework === 'angular1') {
                this.spawnCommand('gulp', ['install']);
            }
        };
        const installConfig = {
            bower: this.clientFramework === 'angular1',
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        if (this.options['skip-install']) {
            this.log(logMsg);
        } else {
            this.installDependencies(installConfig);
        }
    }

    end() {
        this.log('End of social-login-api generator');
    }
};
