#!/usr/bin/env node

var fs = require("fs");
var parserParse = require("./orderly").parse;
var options = require("commander");

options
	.version( JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8")).version )
	.arguments("<file>")
	.action(function (file) {
		options.file = file;
	})
	.option("-o <FILE>, --output-file <FILE>", "write output to the file")
	.option("-t [CHAR], --indent [CHAR]", "character(s) to use for indentation", /^\s+$/i, "  ")
	
options.parse(process.argv);	

function parse(source) {
	try {
		var parsed = parserParse(source);
		return JSON.stringify(parsed, null, options.indent);
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
}

function main(args) {
	var source = '';
	var p = require('path');
	if (options.file) {
		var path = p.resolve(options.file);
		source = parse(fs.readFileSync(path, "utf8"));
		if (options.outfile) {
			fs.writeSync(fs.openSync(p.resolve(options.outfile), 'w+'), source, 0, "utf8");
		} else {
			console.log(source);
		}
	} else {
		var stdin = process.openStdin();
		stdin.setEncoding('utf8');

		stdin.on('data', function(chunk) {
			source += chunk.toString('utf8');
		});
		stdin.on('end', function() {
			console.log(parse(source));
		});
	}
}

main(process.argv.slice(1));
