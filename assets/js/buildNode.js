/**
 * Created by Nate on 4/4/2017.
 */


/**
 * Build a object which simplifies building an html element
 * @returns html text
 */
function buildNode() {
    return {
        content: "",         // contents contais the formatted html of this node
        dict_of_lists: {},   // dict_of_lists is a dictionary which maps a array_name to a list.
        html_tag_errors: {}, // dictionary that keeps track of invalid html_tag errors

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
                console.error("Array: \'" + array_name + "\' does not exist, create the list with the createList() function");
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
                        console.error("Array: \'" + array_name + "\' does not exist, create the list with the createList() function");
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
        format:  function (input, tag, attributes) {
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
                console.error('format() function is missing either INPUT or TAG arguments');
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
        // checks whether a tag is a valid tag.
        // WARNING: this function will only log the same type of error once. So there may be
        //          multiple instances of the error in the same node. This will only flag the first one
        //          it see's.
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