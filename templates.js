import gu from 'koa-gu'

function mainTmpl(fn, embed) {
    return {'name': 'embed.html', 'mime': 'text/html', 'body': gu.tmpl(fn, {embed})};
}

export default {
    map(embed) {
        return [mainTmpl('./templates/map.html', embed)];
    },

    street(embed) {
        var main = mainTmpl('./templates/street.html', embed);
        var images = embed.images.map(image => {
            return {
                'name': image.size.join('x') + '.png',
                'mime': 'image/png',
                'body': new Buffer(image.data.replace(/^data:image\/png;base64,/, ''), 'base64')
            };
        });
        return [main].concat(images);
    }
};
