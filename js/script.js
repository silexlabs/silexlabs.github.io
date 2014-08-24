////////////////////////////////////
// github api
$(function(){
    $('.stats').hide();
    $('.members').hide();
    fillInMembers(function(){
        $('.members').show();
        fillInStats(function(){
            $('.stats').show();
        });
    });
    fillInProjects(function(){});
});
// projects
function fillInProjects(cbk){
    var template = $('.project').get(0);
    var position = $(template).position();
    var w = $(template).width();
    var h = $(template).height();
    var container = template.parentNode;
    var wMax = $(container).width();
    $(template).remove();
    var url = 'https://api.github.com/orgs/silexlabs/repos';
    $.getJSON(url, function(data){
        data.sort(function(a, b){
            return (b.stargazers_count + b.forks) - (a.stargazers_count + a.forks);
        });
        $.each(data, function(idx, project){
            // replace values in the template
            var html = template.innerHTML;
            $.each(project, function(key, value){
                var re = new RegExp('{{' + key + '}}', 'gi');
                value = value || '';
                html = html.replace(re, value);
            });
            // add an element
            var element = template.cloneNode();
            element.innerHTML = html;
            $(container).append(element);
            // position of the new element
            element.style.left = position.left + 'px';
            element.style.top = position.top + 'px';
            // update container height
            if ($(container).height() < position.top + h + 200){
                $(container).height(position.top + h + 200);
            }
            // compute new position
            position.left += w + 20;
            if (position.left + w > wMax){
                position.left = 10;
                position.top += h + 20;
            }
        });
        cbk();
    }).fail(function() {
        element.innerHTML = '<p class="normal">an error occured, maybe github API is down or quota is exceeded</p>';
        cbk();
    });
}
var members = [];
// members
function fillInMembers(cbk){
    var element = $('.members').get(0);
    var url = 'https://api.github.com/orgs/silexlabs/public_members';
    $.getJSON(url, function(data){
        // replace values in the template
        var html = '';
        $.each(data, function(idx, member){
            if (html !== '') html += ' ';
            html += '<a href="' + member.html_url + '"><img alt="' + member.login + '" sr'+'c="' + member.avatar_url + '" style="width: 40px; " /></a>';
            members.push(member);
        });
        var re = new RegExp('{{contributors}}', 'gi');
        element.innerHTML = element.innerHTML.replace(re, html);
        cbk();
    }).fail(function() {
        element.innerHTML = '<p class="normal">an error occured, maybe github API is down or quota is exceeded</p>';
        cbk();
    });
}
// stats
function fillInStats(cbk){
    var element = $('.stats').get(0);
    var url = 'https://api.github.com/orgs/silexlabs';
    $.getJSON(url, function(data){
        // add numMembers to data
        data.numMembers = members.length;
        // replace values in the template
        var html = element.innerHTML;
        $.each(data, function(key, value){
            value = value || '';
            var re = new RegExp('{{' + key + '}}', 'gi');
            html = html.replace(re, value);
        });
        element.innerHTML = html;
        cbk();
    }).fail(function() {
        element.innerHTML = '<p class="normal">an error occured, maybe github API is down or quota is exceeded</p>';
        cbk();
    });
}
