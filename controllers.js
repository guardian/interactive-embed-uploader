import fs from 'fs'
import path from 'path'
import gu from 'koa-gu'
import moment from 'moment'

import templates from './templates'

exports.index = function *() {
    this.body = 'POST only';
};

exports.embed = function *() {
    var type = this.request.query.type;
    var config = gu.config.types[this.request.query.type];
    var {embed} = this.request.body;

    this.set('Access-Control-Allow-Origin', '*');
    this.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    this.set('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (config) {
        let key = moment().format('MMM/YYYY-MM-DDTHH:mm:ss').replace(/(^\w{3})/, a => a.toLowerCase());
        let fullPath = path.join(config.s3basepath, key);
        gu.log.info(`Generating ${type} embed, uploading to ${fullPath}`);

        let files = templates[type](embed);
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            gu.log.info(`   uploading ${file.name}`);
            yield uploadToS3(path.join(fullPath, file.name), file.mime, file.body);
        }

        this.body = `${gu.config.s3domain}/${fullPath}/${files[0].name}`;
    } else {
        gu.log.error(`invalid embed type ${type}`);

        this.status = 400;
        this.body = 'invalid embed type';
    }
};

exports.cors = function *() {
    this.set('Access-Control-Allow-Origin', '*');
    this.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    this.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    this.body = '';
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
