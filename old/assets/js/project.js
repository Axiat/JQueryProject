//now what?
//api:  http://www.ist.rit.edu/api/


    $(document).ready(function(){

        loadAbout();
        loadDegrees();
        loadMinors();
        loadEmployment();
        loadMap();
        loadPeople();
        loadResearch();
        loadNews();
        loadFooter();


    });


    function loadAbout() {
        myXhr('get',{path:'/about/'},'#about').done(function(json){

            var node = buildNode();
            node.add(json.title,'h2');
            node.add(json.description,'p');

            node.add(
                  node.format(json.quote,'p','id="text"')
                + node.format(json.quoteAuthor,'p','id="author"')
                ,'div','class="quote"'
            );

            $('#about').html(node.getHtml());

        });
    }

    function loadPeople() {
        myXhr('get',{path:'/people/'},'#people').done(function(json){
            // do something...
            var node = buildNode();
            $.each(json.faculty,function(i, item){
                node.addRaw( '<div onclick="getFac(this)" data-username="'+item.username+'">' );
                node.addRaw( '<h2>'+item.name+'</h2><p>'+item.tagline+'</p>' );
                node.addRaw( '<img src="'+item.imagePath+'"/></div>' );
            });
            $('#people').html(node.getHtml());
        });
    }


    function loadDegrees() {
        myXhr('get',{path:'/degrees/'},'#degrees').done(function (json) {
            console.log(json);
            var grad  = json.graduate;
            var under = json.undergraduate;

            var g_list = 'grad';
            var u_list = 'under';

            var degrees = buildNode();

            // this list is reused between both lists
            var focuses  = 'concentrations';
            degrees.createList(focuses);


            // undergraduate section
            degrees.add('Undergraduate:','h1');
            degrees.createList(u_list);
            $.each(under, function(index, value) {

                degrees.resetList(focuses);
                $.each(value.concentrations,function (index, value) {
                    degrees.addToList(focuses, degrees.format(value,'p'),'li');
                });

                degrees.addToList(u_list,
                    degrees.format(value.title,'p')
                    + degrees.format(value.degreeName,'p')
                    + degrees.format(value.description,'p')
                    + degrees.listToHtml(focuses,'ul')
                    ,'li');

            });
            degrees.add( degrees.listToHtml(u_list,'ul'), 'div');


            // build graduate section
            degrees.add('Graduate:','h1');
            degrees.createList(g_list);
            $.each(grad, function(index, value) {

                degrees.resetList(focuses);
                $.each(value.concentrations,function (index, value) {
                    degrees.addToList(focuses, degrees.format(value,'p'),'li');
                });

                degrees.addToList(g_list,
                    degrees.format(value.title,'p')
                    + degrees.format(value.degreeName,'p')
                    + degrees.format(value.description,'p')
                    + degrees.listToHtml(focuses,'ul')
                    ,'li');
            });
            degrees.add( degrees.listToHtml(g_list,'ul'), 'div');



            $('#degrees').html(degrees.getHtml());
        });
    }


    function loadMinors() {
        myXhr('get',{path:'/minors/'},"#minors").done(function (json) {
            var minors = buildNode();
            var course_list = 'courses';

            minors.createList(course_list);
            $.each(json.UgMinors,function (index, value) {
                var courses = value.courses;
                minors.add(value.name,'p');
                minors.add(value.title,'p');
                minors.add(value.description,'p');
                minors.add(value.note,'p');

                // add up courses
                minors.resetList(course_list);
                $.each(courses,function (index, value) {
                   minors.addToList(course_list,value,'li')
                });
                minors.add( minors.listToHtml(course_list,'ul'), 'div');


            });

            $('#minors').html(minors.getHtml());
        });
    }

    function loadEmployment() {
        myXhr('get',{path:'/employment/'},"#employment").done(function (json) {
            var employment = buildNode();

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
            stats_div.createList('stats');
            stats_div.add(degreeStats.title,'h2');
            $.each(degreeStats.statistics,function (index, value) {
                stats_div.addToList('stats',
                    stats_div.format(value.description,'p')
                  + stats_div.format(value.value,'p')
                  ,'li');
            });
            stats_div.add(stats_div.listToHtml('stats','ul'),'div');



            // build employers div
            var employers_div = buildNode();
            employers_div.add(employers.title,'h2');
            employers_div.createList('employers');
            $.each(employers.employerNames,function (index, value) {
              employers_div.addToList('employers', value,'li');
            });
            employers_div.add( employers_div.listToHtml('employers','ul'), 'div' );


            // build Co-op Table
            var coop_div = buildNode();
            coop_div.createList('co-ops');
            coop_div.add(coopTable.title,'h2');

            var coop_array  = coopTable.coopInformation;
            var coop_length = coop_array.length;

            for( var i = 0; i < coop_length; i++ ){
                var object = coop_array[i];
                coop_div.addToList('co-ops',
                      coop_div.format(object.city,'p')
                    + coop_div.format(object.degree,'p')
                    + coop_div.format(object.employer,'p')
                    + coop_div.format(object.term,'p')
                    ,'li');
            }
            coop_div.add( coop_div.listToHtml('co-ops','ul'), 'div' );


            // build employment table
            var employ_table = buildNode();
            employ_table.createList('table');
            employ_table.add(employTable.title,'h2');

            var employ_array  = employTable.professionalEmploymentInformation;
            var employ_length = employ_array.length;

            for( var i = 0; i < employ_length; i++ ){
                var object = employ_array[i];
                employ_table.addToList('table',
                      employ_table.format(object.title,'p')
                    + employ_table.format(object.city,'p')
                    + employ_table.format(object.degree,'p')
                    + employ_table.format(object.employer,'p')
                    + employ_table.format(object.startDate,'p')
                    ,'li');
            }
            employ_table.add( employ_table.listToHtml('table','ul'), 'div' );


            // wrap and add child nodes
            employment.add(intro_div.getHtml(),'div');
            employment.add(careers_div.getHtml(),'div');
            employment.add(stats_div.getHtml(),'div');
            employment.add(employers_div.getHtml(),'div');
            // employment.add(coop_div.getHtml(),'div');    // these two statements, load a LOT of html objects
            // employment.add(employ_table.getHtml(),'div');

            $('#employment').html(employment.getHtml());
        });
    }

    function loadResearch() {
        myXhr('get',{path:'/research/'},"#research").done(function (json) {

            var byFaculty = json.byFaculty;
            var c_faculty = 'citations';

            var byIntrest = json.byInterestArea;
            var c_intrest = 'intrest_citations';

            var research_div = buildNode();
            research_div.createList(c_faculty);
            // add up the byFacutly section
            $.each(byFaculty,function (index, value) {

                // add faculty's name and username
                research_div.add(value.facultyName,'b');
                research_div.add(value.username,'p');

                // add up citations
                research_div.resetList(c_faculty);
                $.each(value.citations,function (index, value) {
                    research_div.addToList(c_faculty, research_div.format(value,'p'),'li');
                });

                // add citations
                research_div.add( research_div.listToHtml(c_faculty,'ul') , 'div');
            });


            // add up the byIntrestArea section
            research_div.createList(c_intrest);
            $.each(byIntrest,function (index, value) {
                research_div.add(value.areaName,'p');

                // add up citations
                research_div.resetList(c_intrest);
                $.each(value.citations,function (index, value) {
                    research_div.addToList( c_intrest, research_div.format(value,'p') , 'li' );
                });

                // add citations
                research_div.add( research_div.listToHtml(c_intrest,'ul') , 'div');
            });

            // add research_div content to the page
            $('#research').html(research_div.getHtml());
        });


    }


    function loadResources() {
        myXhr('get', {path: '/resources/'}, "#resources").done(function (json) {

            console.log(json);

            // get all objects
            var title       = json.title;
            var sub_title   = json.subTitle;
            var tutors      = json.tutorsAndLabInformation;
            var abroad      = json.studyAbroad;
            var services    = json.studentServices;
            var ambassadors = json.studentAmbassadors;
            var forms       = json.forms;
            var coops       = json.coopEnrollment;

            // build root node
            var resources = buildNode();

            // student resources title
            resources.add(title,'h1');
            resources.add(sub_title,'h2');

            // tutoring information
            resources.add(tutors.title,'p');
            resources.add(tutors.description,'p');
            resources.add(tutors.tutoringLabHoursLink,'p');

            // study abroad section
            resources.add(abroad.title,'p');
            resources.add(abroad.description,'p');

            var places_list = 'places';
            resources.createList(places_list);
            $.each(abroad.places,function (index, value) {
                resources.addToList(places_list,
                      resources.format(value.nameOfPlace,'p')
                    + resources.format(value.description,'p')
                    , 'li');
            });
            // add places list to resources
            resources.add( resources.listToHtml(places_list,'ul'), 'div');


            // student services section
            resources.add(services.title,'h2');
            var aca_advisors = services.academicAdvisors;
            var fac_advisors = services.facultyAdvisors;
            var ist_advisors = services.istMinorAdvising;
            var pro_advisors = services.professonalAdvisors;

            resources.add(aca_advisors.title,'p');
            resources.add(aca_advisors.description,'p');

            resources.add('FAQ','h2');
            resources.add(aca_advisors.faq.title,'p');
            resources.add(aca_advisors.faq.contentHref,'a','href="' + aca_advisors.faq.contentHref + '"');

            resources.add(fac_advisors.title,'h2');
            resources.add(fac_advisors.description,'p');

            var adv_list = 'advisors';
            resources.createList(adv_list);
            resources.add(ist_advisors.title,'h2');
            $.each(ist_advisors.minorAdvisorInformation,function (index, value) {
                resources.addToList(adv_list,
                      resources.format(value.title,'p')
                    + resources.format(value.advisor,'p')
                    + resources.format(value.email,'p')
                    , 'li');
            });
            resources.add( resources.listToHtml(adv_list,'ul'), 'div' );

            var pro_list = 'pro';
            resources.createList(pro_list);
            resources.add(pro_advisors.title,'h2');
            $.each(pro_advisors.advisorInformation,function (index, value) {
                resources.addToList(pro_list,
                      resources.format(value.name,'p')
                    + resources.format(value.department,'p')
                    + resources.format(value.email,'p')
                    , 'li');
            });
            resources.add( resources.listToHtml(pro_list,'ul'), 'div' );


            // student ambassador section
            resources.add(ambassadors.title,'h2');
            resources.add('','img','src="' + ambassadors.ambassadorsImageSource + '"');

            var amb_list = 'amb_list';
            resources.createList(amb_list);
            $.each(ambassadors.subSectionContent,function (index, value) {
                resources.addToList(amb_list,
                      resources.format(value.title,'p')
                    + resources.format(value.description,'p')
                    , 'li');
            });
            resources.add( resources.listToHtml(amb_list,'ul'), 'div' );

            resources.add('RIT ambassador application','h3');
            resources.add(ambassadors.applicationFormLink,'a', 'href="' + ambassadors.applicationFormLink + '"' );
            resources.add('Contact','h3');
            resources.add(ambassadors.note,'p');



            // forms section
            resources.add('Forms','h3');
            var grad_list  = 'graduate';
            var ugrad_list = 'undergrad';

            resources.add('Graduate','h3');
            resources.createList(grad_list);
            $.each(forms.graduateForms,function (index, value) {
                resources.addToList(grad_list,
                      resources.format(value.formName,'p')
                    + resources.format(value.href,'a','href="' + value.href + '"')
                    , 'li');
            });
            resources.add( resources.listToHtml(grad_list,'ul'), 'div' );

            resources.add('Undergrad','h3');
            resources.createList(ugrad_list);
            $.each(forms.undergraduateForms,function (index, value) {
                resources.addToList(ugrad_list,
                      resources.format(value.formName,'p')
                    + resources.format(value.href,'a','href="' + value.href + '"')
                    , 'li');
            });
            resources.add( resources.listToHtml(ugrad_list,'ul'), 'div' );


            // coop section

            resources.add(coops.title,'h2');
            resources.add('RIT Job Zone','a','href="' + coops.RITJobZoneGuidelink + '"');

            var enroll_list = 'enroll';
            resources.createList(enroll_list);
            $.each(coops.enrollmentInformationContent,function (index, value) {
                resources.addToList(enroll_list,
                      resources.format(value.title,'p')
                    + resources.format(value.description,'p')
                    , 'li');
            });
            resources.add( resources.listToHtml(enroll_list,'ul'), 'div' );


            $('#resources').html(resources.getHtml());
        });
    }


    function loadNews() {
        myXhr('get', {path: '/news/'}, "#news").done(function (json) {

            console.log(json);

            // getting the values
            var older_array     = json.older;
            var quarter_array   = json.quarter;
            var year_array      = json.year;

            // naming the lists
            var old_list     = 'old';
            var quarter_list = 'quarter';
            var year_list    = 'year';

            var news = buildNode();

            news.createList(old_list);
            $.each(older_array,function (index, value) {
                news.addToList(old_list,
                    news.format(value.title,'p')
                  + news.format(value.date,'p')
                  + news.format(value.description,'p')
                  ,'li');
            });
            news.add( news.listToHtml(old_list,'ul'), 'div' );

            news.createList(quarter_list);
            $.each(quarter_array,function (index, value) {
                news.addToList(quarter_list,
                      news.format(value.title,'p')
                    + news.format(value.date,'p')
                    + news.format(value.description,'p')
                    ,'li');
            });
            news.add( news.listToHtml(quarter_list,'ul'), 'div' );

            news.createList(year_list);
            $.each(year_array,function (index, value) {
                news.addToList(year_list,
                      news.format(value.title,'p')
                    + news.format(value.date,'p')
                    + news.format(value.description,'p')
                    ,'li');
            });
            news.add( news.listToHtml(year_list,'ul'), 'div' );


            $('#news').html(news.getHtml());
        });
    }

    function loadFooter() {
        myXhr('get', {path: '/footer/'}, "#footer").done(function (json) {
            console.log(json);

            var copyright = json.copyright;
            var links     = json.quickLinks;
            var social    = json.social;

            var footer = buildNode();
            var social_list = 'social';

            // copyright
            footer.add(copyright.title,'h2');
            footer.addRaw(copyright.html);

            // quick links
            footer.createList(social_list);
            $.each(links,function (index, value) {
                footer.addToList(social_list,
                      footer.format(value.title,'p')
                    + footer.format(value.href,'a','href="' + value.href + '"')
                    ,'li');
            });
            footer.add( footer.listToHtml(social_list,'ul'), 'div' );

            // social
            footer.add(social.title,'p');
            footer.add(social.by,'p');
            footer.add('Facebook','a','href="' + social.facebook + '"');
            footer.add('','br');
            footer.add('Twitter','a','href="' + social.twitter + '"');
            footer.add(social.tweet,'p');

            $('#footer').html(footer.getHtml());
        });
    }
    
    function loadCourse(id) {
        myXhr('get', {path: '/course/courseID=' + id}, "#footer").done(function (json) {
            var course = buildNode();
            course.add(json.title,'h2');
            course.add(json.description,'p');

            $('#course').html(course.getHtml());
        });
    }


    function loadMap() {

        var map_node = buildNode();
        map_node.add('','iframe','src="https://ist.rit.edu/api/map/"width="100%" height="600px"');

        $('#map').html(map_node.getHtml());

    }


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


function myHTMLxhr(t, d, id){
    return $.ajax({
        type:t,
        url:'proxy.php',
        dataType:'html',
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




