var express = require('express'),
    fs = require('fs'),
    execSync = require('child_process').execSync,
    mime = require('mime'),
    path = require('path'),
    mkdirp = require('mkdirp');

var host = process.env.HTTP_HOST || '0.0.0.0';
var port = process.env.HTTP_PORT || 3000;

var app = express();

app.get('/_ping', (req, res) => {
    res.status(200).end();
});


/**
 Bundle containing all the user's private keys and ssh configuration
 */
app.get('/ssh.tgz', async (req, res) => {
    mkdirp("/vault/.ssh");

    const stdout = execSync('mktemp -q /tmp/ssh.XXXXXX');
    const file = stdout.toString().match(/(.+)/)[0];

    execSync('tar -chz -C /vault/.ssh -f ' + file + ' .');
    const filename = path.basename(file);
    const mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    const filestream = fs.createReadStream(file);
    await filestream.pipe(res);

    fs.unlinkSync(file);
});


/**
 Route to get the ONVAULT utility to be used during build
 */
app.get('/ONVAULT', async (req, res) => {
    var file = path.join(__dirname, 'ONVAULT');
    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    await filestream.pipe(res);
});

app.use('/', express.static('/vault'));

app.listen(port, host, function () {
    console.log('Service started on port %d', port);
});
