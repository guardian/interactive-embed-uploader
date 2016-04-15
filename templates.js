import gu from 'koa-gu'

function mainTmpl(fn, context) {
    return {'name': 'embed.html', 'mime': 'text/html', 'body': gu.tmpl(fn, context)};
}

export default {
    map(embed) {
        return [mainTmpl('./templates/map.html', {embed})];
    },

    chart(embed) {
        return [{'name': 'embed.html', 'mime': 'text/html', 'body': embed}];
    },

    street(embed) {
        var images = embed.images.map((image, imageNo) => {
            var prevImage = embed.images[imageNo - 1];
            return {
                'name': image.size.join('x') + '.png',
                'mime': 'image/png',
                'body': new Buffer(image.data.replace(/^data:image\/png;base64,/, ''), 'base64'),
                'minWidth': prevImage && prevImage.size[0] || 0,
                'ratio': image.size[1] / image.size[0]
            }
        });
        var main = mainTmpl('./templates/street.html', {images});
        return [main].concat(images);
    }
};
