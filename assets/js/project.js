//now what?
//api:  http://www.ist.rit.edu/api/

$(document).ready(function(){
    loadEmployment();
});


/**
 * Build a object which simplifies building an html element
 * @returns html text
 */
function buildNode() {
    return {
        content: "",        // contents contais the formatted html of this node
        dict_of_lists: {},  // dict_of_lists is a dictionary which maps a array_name to a list.
        html_tag_errors: {},// dictionary that keeps track of invalid html_tag errors
        // add a custom element with tag, by default content is added to the end
        add: function (input, tag, attributes) {
            if( input !== undefined && tag !== undefined ) {
                if( this.validateTag(tag) ){
                    if ( attributes === undefined ) {
                        this.content += "<" + tag + ">" + input + "</" + tag + ">";
                    }
                    else {
                        this.content += "<" + tag + " " + attributes + ">" + input + "</" + tag + ">";
                    }
                }
            }
            else{
                console.error('add() function is missing either INPUT or TAG arguments');
            }
        },
        // add a custom element with tag in front of the other content
        addToFront: function (input, tag, attributes) {
            if( input !== undefined && tag !== undefined ) {
                if( this.validateTag(tag) ){
                    if ( attributes === undefined ) {
                        this.content = "<" + tag + ">" + input + "</" + tag + ">" + this.content;
                    }
                    // allow for attributes to be added to an element
                    else {
                        this.content = "<" + tag + " " + attributes + ">" + input + "</" + tag + ">" + this.content;
                    }
                }
            }
            else{
                console.error('addToFront() function is missing either INPUT or TAG arguments');
            }
        },
        // create empty list and associate it with a list
        createList: function (array_name) {
            this.dict_of_lists[array_name] = [];
        },
        // add item to given lists name
        addToList: function (array_name,input,tag,attributes) {
            if(this.dict_of_lists[array_name] === undefined){
                console.error("Array: " + array_name + " does not exist, create the list with the createList() function");
            }
            else{
                // bare minimum, must be given input text and the name of the array to add to.
                if( input !== undefined && array_name !== undefined ){
                    // case 1: no attributes, just a tag
                    if( attributes === undefined && tag !== undefined && this.validateTag(tag) ) {
                        this.dict_of_lists[array_name].push( "<" + tag + ">" + input + "</" + tag + ">");
                    }
                    // case 2: no attributes, no tag
                    else if( attributes === undefined && tag === undefined && this.validateTag(tag) ){
                        this.dict_of_lists[array_name].push(  input  );
                    }
                    // case 3: attributes and tag are included
                    else{
                        this.dict_of_lists[array_name].push( "<" + tag + " " + attributes + ">" + input + "</" + tag + ">" );
                    }
                }
                else{
                    console.error('addToList() function is missing either INPUT or ARRAY_NAME argument');
                }
            }

        },
        // grab the array and convert the array to a valid html list and return that html
        listToHtml: function (array_name,tag,attributes) {
            if( tag === undefined ){
                console.error('listToHtml() is missing TAG argument');
            }
            else{
                if( this.validateTag(tag) ){
                    var array  = this.dict_of_lists[array_name];
                    if(array !== undefined){
                        var length = array.length;
                        var list_node = buildNode();

                        for(var i = 0; i < length; i++){
                            // we assume the optional tags and attributes are already included
                            list_node.addRaw(array[i]);
                        }
                        list_node.wrapContent(tag,attributes);
                        return list_node.getHtml();
                    }
                    else{
                        console.error("Array: " + array_name + " does not exist, create the list with the createList() function");
                    }
                }
            }
        },
        // wrap current content with a given tag and optional attributes
        wrapContent: function (tag,attributes) {
            if( tag !== undefined ) {
                if( this.validateTag(tag) ){
                    if (attributes === undefined) {
                        this.content = "<" + tag + ">" + this.content + "</" + tag + ">";
                    }
                    else {
                        this.content = "<" + tag + " " + attributes + ">" + this.content + "</" + tag + ">";
                    }
                }
            }
            else{
                console.error('wrapContent() function is missing the TAG argument');
            }
        },
        // a helper function to easily format a given input string to valid HTML
        formatInput:  function (input, tag, attributes) {
            if(input !== undefined && tag !== undefined ) {
                if( this.validateTag(tag) ){
                    if (attributes === undefined) {
                        return "<" + tag + ">" + input + "</" + tag + ">";
                    }
                    else {
                        return "<" + tag + " " + attributes + ">" + input + "</" + tag + ">";
                    }
                }
            }
            else{
                console.error('formatInput() function is missing either INPUT or TAG arguments');
            }
        },
        // add raw string
        addRaw: function (input) {
            if(input !== undefined) {
                this.content += input;
            }
            else{
                console.error('addRaw() function is missing the INPUT argument');
            }
        },
        // add raw string to the front of the content
        addRawToFront: function (line) {
            if(line !== undefined) {
                this.content = line + this.content;
            }
            else{
                console.error('addRawToFront() function is missing the INPUT argument');
            }
        },
        // checks whether a tag is a valid tag
        validateTag: function (tag) {
            var isValid = document.createElement(tag).toString() != "[object HTMLUnknownElement]";
            if( ! isValid ){
                // if invalid tag, add to our dict of errors
                if( this.html_tag_errors[ tag ] === undefined ){
                    this.html_tag_errors[ tag ] = true;
                    console.error( tag + ' is not a valid HTML tag' );
                }
            }
            return isValid;
        },
        // return the content
        getHtml: function () {
            return this.content;
        }
    };

}


function loadAbout() {
    myXhr('get',{path:'/about/'},'#about').done(function(json){

        var node = buildNode();
        node.add(json.title,'h2');
        node.add(json.description,'p');
        node.add(json.quote,'p');
        node.add(json.quoteAuthor,'p');

        $('#about').html(node.getHtml());

    });
}

function loadPeople() {
    myXhr('get',{path:'/people/'},'#people').done(function(json){
        // do something...
        var node = buildNode();
        $.each(json.faculty,function(i, item){
            //item === this
            console.log(i);
            console.log(item);
            console.log($(this));

            node.addRaw( '<div onclick="getFac(this)" data-username="'+item.username+'">' );
            node.addRaw( '<h2>'+item.name+'</h2><p>'+item.tagline+'</p>' );
            node.addRaw( '<img src="'+item.imagePath+'"/></div>' );
        });
        $('#people').html(node.getHtml());
    });
}


function loadDegrees() {
    myXhr('get',{path:'/degrees/'},'#degrees').done(function (json) {
        var all_content = buildNode();

        var undergrad = buildNode();
        $.each(json.undergraduate,function(index,item) {
            var concentrations = item.concentrations;
            undergrad.add(item.title);
            undergrad.add(item.degreeName,'p');
            undergrad.add(item.description,'p');

        });

        var graduate = buildNode();
        $.each(json.graduate, function (index, item) {
            graduate.add(item.title,'p');
            graduate.add(item.degreeName,'p');
            graduate.add(item.description,'p');
        });

        all_content.addRaw( undergrad.getHtml() + graduate.getHtml());
        $('#degrees').html(all_content.getHtml());
    });
}


function loadMinors() {
    myXhr('get',{path:'/minors/'},"#minors").done(function (json) {
        var minors = buildNode();
        $.each(json.UgMinors,function (index, value) {
            var courses = value.courses;
            minors.add(value.name,'p');
            minors.add(value.title,'p');
            minors.add(value.description,'p');
            minors.add(value.note,'p');
            minors.add(courses.toString(),'p');
        });

        $('#minors').html(minors.getHtml());
    });
}

function loadEmployment() {
    myXhr('get',{path:'/employment/'},"#employment").done(function (json) {
        var employement = buildNode();

        console.log(json);

        // get all fields
        var introduction = json.introduction;
        var careers      = json.careers;
        var degreeStats  = json.degreeStatistics;
        var coopTable    = json.coopTable;
        var employers    = json.employers;
        var employTable  = json.employmentTable;


        // build introduction node;
        var intro_div = buildNode();
        intro_div.add(introduction.title,'h2');
        $.each(introduction.content,function (index,value) {
            intro_div.add(value.title,'h2');
            intro_div.add(value.description,'p');
        });

        // build careers div
        var careers_div = buildNode();
        careers_div.add(careers.title,'h2');
        $.each(careers.careerNames,function (index, value) {
            careers_div.add(value,'p');
        });

        // build degreeStats div
        var stats_div = buildNode();
        var list_name = 'stats';
        stats_div.createList(list_name);

        stats_div.add(degreeStats.title,'h2');
        $.each(degreeStats.statistics,function (index, value) {
            // stats_div.addToList(list_name,
            //             '<p>' + value.description + '</p>' +
            //             '<p>'+ value.value + '</p>',
            //     'li');

            stats_div.addToList(list_name,

                stats_div.formatInput(value.description,'p') +
                stats_div.formatInput(value.value,'p')

                ,'li'
            );
        });
        stats_div.add(stats_div.listToHtml(list_name,'ul'),'div');


        // wrap and add child nodes
        employement.add(intro_div.getHtml(),'div');
        employement.add(careers_div.getHtml(),'div');
        employement.add(stats_div.getHtml(),'div');

        $('#employment').html(employement.getHtml());
    });
}



//employment



function getFac(dom){
    myXhr('get',{path:'/people/faculty/username='+$(dom).attr('data-username')},null).done(function(json){
        console.log(json);
    });
}
///////////////////////////////////////////////////
//utilities...
//data - {path:'/about/'}
//(getOrPost, data, idForSpinner)
function myXhr(t, d, id){
    return $.ajax({
        type:t,
        url:'proxy.php',
        dataType:'json',
        data:d,
        cache:false,
        async:true,
        beforeSend:function(){
            //PLEASE - get your own spinner that 'fits' your site.
            $(id).append('<img src="gears.gif" class="spin"/>');
        }
    }).always(function(){
        //kill spinner
        $(id).find('.spin').fadeOut(5000,function(){
            $(this).remove();
        });
    }).fail(function(){
        //handle failure
    });
}

