function purifyResult(result)
{
    if (null != result.entry) {
        for (var index = 0, count = result.entry.length; count > index; ++index) {
            var entry = result.entry[index];
            if (null != entry.url) { entry.url = encodeLink(entry.url); }
            if (null != entry.image) { entry.image = encodeLink(entry.image); }
            if (null != entry.title) { entry.title = purifyText(entry.title); }
            if (null != entry.tag) { entry.tag = purifyText(entry.tag); }
            if (null != entry.author) { entry.author = purifyText(entry.author); }
            if (null != entry.suffix) { entry.suffix = purifyText(entry.suffix); }
            if (null != entry.update) { entry.update = purifyText(entry.update); }
            if (null != entry.volume) { entry.volume = purifyText(entry.volume); }
            if (null != entry.referer) { entry.referer = encodeLink(entry.referer); }
        }
    }
    if (null != result.header) {
        var entry = result.header;
        if (null != entry.referer) { entry.referer = encodeLink(entry.referer); }
    }
    if (null != result.intro) {
        var entry = result.intro;
        if (null != entry.desc) { entry.desc = purifyText(entry.desc); }
        if (null != entry.image) { entry.image = encodeLink(entry.image); }
        if (null != entry.title) { entry.title = purifyText(entry.title); }
        if (null != entry.author) { entry.author = purifyText(entry.author); }
        if (null != entry.status) { entry.status = purifyText(entry.status); }
        if (null != entry.update) { entry.update = purifyText(entry.update); }
    }
    if (null != result.page) {
        for (var index = 0, count = result.page.length; count > index; ++index) {
            var entry = result.page[index];
            if (null != entry.url) { entry.url = encodeLink(entry.url); }
            if (null != entry.title) { entry.title = purifyText(entry.title); }
        }
    }
    if (null != result.verify) {
        for (var index = 0, count = result.verify.length; count > index; ++index) {
            var entry = result.verify[index];
            if (null != entry.image) { entry.image = encodeLink(entry.image); }
        }
    }
}
function encodeLink(link)
{
    link = link.trim();
    if (0 == link.search("../")) { link = link.replace("../", "/"); }
    if (0 == link.search("//")) { link = "http:" + link; }
    if (0 != link.search("http")) { link = Essential.url + link; }
    if (-1 == link.search("%")) { link = encodeURI(link); }
    return link;
}
function purifyText(text)
{
    return Utility.string.decodeSpecial(text.replace(/amp;/gi, "")).trim();
}
function filterTag(tag)
{
    tag = tag.trim().toLowerCase();
    var hit = false;
    for (var filter in site.filters) {
        if (-1 != tag.search(site.filters[filter])) {
            hit = true;
            break;
        }
    }
    return hit;
}
function filterEntryTag(result)
{
    if (null == result.entry) {
        return;
    }
    var hits = new Array();
    for (var index = 0, count = result.entry.length; count > index; ++index) {
        var entry = result.entry[index];
        if (null == entry.tag) { continue; }
        if (true == filterTag(entry.tag)) {
            hits.unshift(index);
        }
    }
    for (var index = 0, count = hits.length; count > index; ++index) {
        result.entry.splice(hits[index], 1);
    }
}
function filterIntroTag(result)
{
    if (null == result.intro) {
        return false;
    }
    if (null == result.intro.tag) {
        return false;
    }
    return filterTag(result.intro.tag);
}
function purifyEntryTitle(result) {
    purifyEntryTitle(result, false);
}
function purifyEntryTitle(result, all)
{
    if (null == result.intro.title) {
        return;
    }
    if (null == result.entry) {
        return;
    }
    var parameter = (false == all) ? "i" : "gi"
    for (var index = 0, count = result.entry.length; count > index; ++index) {
        var entry = result.entry[index];
        try { entry.title = entry.title.replace(new RegExp("(" + result.intro.title + ")", parameter), "").trim(); } catch (e) {}
    }
}
function useEntryUpdate(result)
{
    if (null == result.intro) {
        return;
    }
    if (null == result.entry) {
        return;
    }
    if (0 == result.entry.length) {
        return;
    }
    result.intro.update = result.entry[0].update;

    for (var index = 0, count = result.entry.length; count > index; ++index) {
        var entry = result.entry[index];
        delete entry.update;
    }
}
