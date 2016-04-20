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
        var maps = embed.maps.map((map, mapNo) => {
            var prevMap = embed.maps[mapNo - 1];
            return {
                'name': `${map.width}x${map.height}.png`,
                'mime': 'image/png',
                'body': new Buffer(map.image.replace(/^data:image\/png;base64,/, ''), 'base64'),
                'minWidth': prevMap && prevMap.width || 0,
                'width': map.width,
                'height': map.height,
                'annotations': map.annotations
            };
        });
        var main = mainTmpl('./templates/street.html', {'source': embed.source, maps});
        return [main].concat(maps);
    }
};
