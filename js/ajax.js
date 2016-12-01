$(document).ready(function() {

    $('#js-make-an-ajax-call').on('click', function(event) {
        event.preventDefault();

        var queryValue = $('#js-search-query').val();

        var availableResources = '&resources=';

        if ($('#limit-results--games')[0].checked) availableResources += 'game,';
        if ($('#limit-results--franchises')[0].checked) availableResources += 'franchise,';
        if ($('#limit-results--characters')[0].checked) availableResources += 'character,';
        if ($('#limit-results--concepts')[0].checked) availableResources += 'concept,';
        if ($('#limit-results--objects')[0].checked) availableResources += 'object,';
        if ($('#limit-results--locations')[0].checked) availableResources += 'location,';
        if ($('#limit-results--persons')[0].checked) availableResources += 'person,';
        if ($('#limit-results--companies')[0].checked) availableResources += 'company,';

        if (queryValue !== '') _makeACall(queryValue, availableResources);
    });

    $('#js-search-query').keypress(function(event) {

        if (event.keyCode == 13) {

            var queryValue = $('#js-search-query').val();

            var availableResources = '&resources=';

            if ($('#limit-results--games')[0].checked) availableResources += 'game,';
            if ($('#limit-results--franchises')[0].checked) availableResources += 'franchise,';
            if ($('#limit-results--characters')[0].checked) availableResources += 'character,';
            if ($('#limit-results--concepts')[0].checked) availableResources += 'concept,';
            if ($('#limit-results--objects')[0].checked) availableResources += 'object,';
            if ($('#limit-results--locations')[0].checked) availableResources += 'location,';
            if ($('#limit-results--persons')[0].checked) availableResources += 'person,';
            if ($('#limit-results--companies')[0].checked) availableResources += 'company,';

            if (queryValue !== '') _makeACall(queryValue, availableResources);
        }
    });

    function _makeACall(query, resources) {

        $('#js-loader').fadeIn(300, function() {
            var resourcesTypes = '';

            if (resources !== '&resources=') {
                resourcesTypes = resources;
            } else {
                resourcesTypes = '&resources=game,franchise,character,concept,object,location,person,company'
            }

            var urlAjax = `https://www.giantbomb.com/api/search/?api_key=705119da0da320b8d75b26fcddedbf55aa5e3663&format=jsonp&query="${query}"${resourcesTypes}`;
            var markup = '';

            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                jsonp: 'json_callback',
                url: urlAjax,
                success: function(data) {
                    if (data.results.length) {
                        $.each(data.results, function(index) {
                            markup += _createEntry(data.results[index]);
                        });
                    } else {
                        markup = '<p class="a-paragraph a-paragraph--watermark">Try again. Unfortunately, there are no search results.</p>';
                    }

                    $('#js-search-results').children().slideUp(300, function() {
                        $('#js-search-results').html(markup).promise().done(function() {
                            $('#js-search-results').imagesLoaded(function() {
                                initializeTilt(function() {
                                    $('#js-loader').fadeOut(300);
                                });
                            });
                        });
                    });

                }
            });
        });
    }

    function _createEntry(item) {
        var result = '';

        result += `<article class="m-item">
                    <div class="m-item__container">`;

        if (item.image) {
            result += `<a class="m-item__img-container" target="_blank" href="${item.site_detail_url}" title="${item.name}">
                        <img class="m-item__cover" src="${item.image.medium_url}" width="100%" alt="${item.name}">
                    </a>`;
        }

        result += `<div class="m-item__content">
                            <header>
                                <p class="m-item__type a-paragraph a-paragraph--tertiary">${item.resource_type}</p>
                                <h2 class="m-item__title a-title a-title--secondary">
                                  <a class="a-link a-link--primary" target="_blank" href="${item.site_detail_url}" title="${item.name}">
                                    <span data-hover="${item.name}" class="a-link__subelement a-link__subelement--primary">${item.name}</span>
                                  </a>
                                </h2>
                            </header>`;
        if (item.deck) {
            result += `<p class="m-item__description a-paragraph a-paragraph--primary">
                ${item.deck}
            </p>`;
        }
        result += `</div>
                    </div>
                </article>`;

        return result;
    }
});
