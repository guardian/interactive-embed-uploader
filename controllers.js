import fs from 'fs'
import path from 'path'
import gu from 'koa-gu'
import moment from 'moment'

exports.index = function *() {
    this.body = 'POST only';
};

exports.embed = function *() {
    var type = this.request.query.type;
    var config = gu.config.types[this.request.query.type];
    var {embed} = this.request.body;

    if (config) {
        let key = moment().format('MMM/YYYY-MM-DDTHH:mm:ss').replace(/(^\w{3})/, a => a.toLowerCase());
        let fullPath = path.join(config.s3basepath, key + '.html');

        gu.log.info(`Generating ${type} embed using template ${config.template || 'NONE'}, uploading to ${fullPath}`);

        let out = config.template ? gu.tmpl(path.join('./templates', config.template), {embed}) : embed;

        yield uploadToS3(fullPath, config.mimeType, out);
        this.body = `${gu.config.s3domain}/${fullPath}`;
    } else {
        gu.log.error(`invalid embed type ${type}`);

        this.status = 400;
        this.body = 'invalid embed type';
    }
};

function uploadToS3(filename, mimeType, body) {
    var params = {
        Bucket: gu.config.s3bucket,
        Key: filename,
        Body: body,
        ACL: 'public-read',
        ContentType: mimeType,
        CacheControl: 'max-age=2592000'
    }
    return gu.s3.putObject(params);
}
