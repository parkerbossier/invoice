/**
 * Returns a new array consisting of the unique elements of the subject array
 * 
 * @returns {array}
 */
Array.prototype.filterUnique = function() {
    var self = this;
    return this.filter(function(item, position) {
        return self.indexOf(item) === position;
    });
};

// add derived work item properties
Invoice.workItems = Invoice.workItems.map(addDerrivedWorkItemProperties);

// newline-ify the addresses
Invoice.clientAddress = Invoice.clientAddress.join('<br/>');
Invoice.self.address = Invoice.self.address.join('<br/>');

// get totals by project
var projectNames = Invoice.workItems.map(function(item) {
    return item.project;
}).filterUnique().sort();
var projectTotals = projectNames.map(function(projectName) {
    var cost = Invoice.workItems
            .filter(function(item) {
                return item.project === projectName;
            })
            .reduce(function(a, b) {
                return a + b.cost;
            }, 0);
    return {
        name: projectName,
        cost: cost
    };
});
Invoice.projectTotals = projectTotals;

// get the overall total
Invoice.totalCost = Invoice.workItems.reduce(function(a, b) {
    return a + b.cost;
}, 0);

/**
 * Adds/updates derrived fields to the given item
 * (e.g. rate, cost)
 * 
 * @param {object} item
 * @returns {object}
 */
function addDerrivedWorkItemProperties(item) {
    if (item.rate === undefined)
        item.rate = Invoice.baseRate;
    item.cost = (item.hours + item.minutes / 60) * item.rate;

    return item;
}

/**
 * Returns a pretty cost (e.g. $3.50)
 * 
 * @param {number} cost
 * @returns {string}
 */
function prettifyCost(cost) {
    var cost = '$' + cost.toFixed(2);
    for (var i = cost.indexOf('.') - 3; i > 1; i -= 3) {
        cost = cost.substr(0, i) + ',' + cost.substr(i);
    }
    return cost;
}

/**
 * Returns a pretty duration (e.g. 0:35)
 * 
 * @param {number} hours
 * @param {number} minutes
 * @returns {string}
 */
function prettifyDuration(hours, minutes) {
    return hours + ':' + (minutes < 10 ? '0' : '') + minutes;
}

/**
 * Paginate the content by splitting the work items across several pages as necessary
 */
function paginateContent() {
    var $footer = $('footer');
    var $summarySection = $('.summary-section');
    var summarySectionHeight = $summarySection.outerHeight(true);
    $summarySection.remove();
    var $workSectionCap = $('.work-section-cap');
    var workSectionCapHeight = $workSectionCap.height();
    $workSectionCap.remove();

    $('.work-row').each(function() {
        var $this = $(this);
        var $page = $this.closest('.page');

        // first overflowing row. paginate
        if ($this.offset().top + $this.outerHeight(true) + workSectionCapHeight > $page.offset().top + $page.height()) {
            var $workSection = $this.closest('.work-section');
            var $overflowRows = $this.siblings()
                    .filter(':gt(' + ($this.index() - 2) + ')').remove();
            var $newPage = $('<div>').addClass('page');

            $newPage.append($workSection.clone());
            $newPage.find('.work-row-wrapper').html($overflowRows);
            $('body').append($newPage);
        }
    });

    // add the section cap
    $('.work-row-wrapper:last').append($workSectionCap);

    // add the closing content on the last page
    var $lastPage = $('.page:last');
    var lastPageContentHeight = $lastPage.children().map(function() {
        return $(this).outerHeight(true);
    }).toArray().reduce(function(a, b) {
        return a + b;
    }, 0);
    if ($lastPage.height() - lastPageContentHeight >= summarySectionHeight)
        $('.page:last').append($summarySection);
    else {
        $lastPage = $('<div>').addClass('page').append($summarySection);
        $('body').append($lastPage);

        // vertically align
        $summarySection.css({
            'padding-top': ($lastPage.height() - summarySectionHeight) / 4 + 'pt'
        });
    }

    // add the footer
    $('.page:last').append($footer).addClass('footer-placed');
}

/**
 * Knockout view model
 */
function InvoiceViewModel() {
    // incorporate the Invoice into me
    $.extend(this, Invoice);
}

$(function() {
    document.title = 'Invoice ' + Invoice.number;
    ko.applyBindings(new InvoiceViewModel());
    paginateContent();
});
