import {Command} from "ecli-base/dist/src/lib/command/Command";
import {basePath, joinPaths} from "ecli-base/dist/src/lib/helper/path";
import assert from "node:assert";
import Directory from "ecli-base/dist/src/lib/sys/Directory";
import File from "ecli-base/dist/src/lib/sys/File";
import terminal from "ecli-base/dist/src/decorator/terminal";
import validateProps from "ecli-base/dist/src/decorator/validateProps";

export default class alias extends Command {
    @terminal({
        description: 'Generate Alias for bunch of custom command written by you in any project written in js ',
        paras: {
            force: {
                description: "Force the process if it has been registered before - default is false",
                example: "force:true"
            },
            cwd: {
                description: "Append the current directory to the base - default is true",
                example: "cwd:false"
            },
            build: {
                description: "Runs the command in the base directory provided by you - default is null",
                example: "npm run build"
            },
            name: {
                description: "Your command is acknowledged by this name",
                example: "name:generator"
            },
            base: {
                description: "Your project base - default is ./",
                example: "base:../src"
            },
            commands: {
                description: "Where your commands directory is inside your base. Note that you should provide the compiled typescript directory if your are using typescript.",
                example: "commands:./dist/src/commands"
            },
        }
    })

    @validateProps<Parameters<InstanceType<typeof alias>['index']>[0]>({
        type: "object",
        properties: {
            force: {
                type: "boolean",
                nullable: true,
                default: false,
            },
            build: {
                type: "string",
                nullable: true,
                default: null,
            },
            cwd: {
                type: "boolean",
                nullable: true,
                default: true,
            },

            name: {
                type: "string",
            },
            base: {
                type: "string",
                nullable:true,
                default : './'
            },
            commands: {
                type: "string",
            },
        },
        required: [
            'name',
            'commands'
        ],
        additionalProperties: false
    })

    index(args: {
        force?: boolean,
        cwd?: boolean,
        build?: string,

        name: string,
        base?: string,
        commands: string,

    }): any {
        const directivePath = basePath('custom-directive', args.name);
        assert(args.force || !Directory.exists({path: directivePath}), 'Already exists. use force:true');
        Directory.delete({path: directivePath});
        Directory.create({path: directivePath});

        File.writeJson({
            path: joinPaths(directivePath, 'directive.json'),
            data: {
                name: args.name,
                base: args.cwd === false ? args.base : joinPaths(process.cwd(), args.base ?? ''),
                commands: args.commands,
                build: args.build,
            },
        })

        return true;
    }
}