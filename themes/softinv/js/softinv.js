//
// Note: after changing this code you might need to go to
// admin/config/development/performance
// and manually "Clear all caches" for the changes to take effect.
//
//
var JoinTables = (function () {
  // private
  populate = function(rows, array_label, softwareRow, personRow) {
    var person, software;
    rows.each(function( index ) {
    if (personRow != null) {
      person = jQuery(this).find('td a')[personRow];
    }
    software = jQuery(this).find('td a')[softwareRow];

    if (person != undefined) {
      // Add the person to the list of people
      JoinTables.userUrls[person.innerHTML]       = person.href;
      // Add a new user hashByUser, with empty arrays storing the software they know how to use
      if (!JoinTables.hashByUser.hasOwnProperty(person.innerHTML)) {
        JoinTables.hashByUser[person.innerHTML] = { user: [], expert: [] };
      }
    }

    if (software != undefined) {
      // Add the software to the list of all software URLS
      JoinTables.softwareUrls[software.innerHTML] = software.href;
      // Add a new software to hashBySoftware, with empty arrays storing the users of that software
      if (!JoinTables.hashBySoftware.hasOwnProperty(software.innerHTML)) {
        JoinTables.hashBySoftware[software.innerHTML] = { user: [], expert: [] };
      }
      if (person != undefined) {
        // Add the user to the list of people who know how to use this software.
        JoinTables.hashBySoftware[software.innerHTML][array_label].push([person.innerHTML, person.href]);
        // Add the software to that user's hashByUser
        JoinTables.hashByUser[person.innerHTML][array_label].push([software.innerHTML, software.href]);
      }
    }
  });
};

  return {

    hashByUser: {},
    hashBySoftware: {},
    userUrls: {},
    softwareUrls: {},

    populateSoftware: function () {
      rows = jQuery('div.view-all-software div.view-content table tbody tr');
      populate(rows, null, 0, null);
    },

    populateUsers: function () {
      rows = jQuery('div.view-users-hidden div.view-content table tbody tr');
      populate(rows, 'user', 1, 0);
    },

    populatePowerUsers: function () {
      rows = jQuery('div.view-power-users-hidden div.view-content table tbody tr');
      populate(rows, 'expert', 1, 0);
    },

    container: function() {
      return jQuery('div.block-system-main-block div.content').first();
    },

    // Takes an array of the form [[text, URL], [text, URL], ...]
    // and returns an string of comma-separated HTML links.
    concatenatedLinks: function(input_array) {
      var result = [];
      jQuery.each(input_array, function() { // input_array was v.user
        result.push('<a href="' + this[1]+'">' + this[0]+ '<a>');
      });
      return result.join("; ");
    },

    createAllUsersTable: function () {
      JoinTables.container().append('<div><table class="joinTable"><tr><th width="30%">Person</th><th width="30%" >Power user of</th><th width="30%">Also uses</th></tr></table></div>');
      jQuery.each(Object.keys(JoinTables.hashByUser).sort(), function(k) {
        v = JoinTables.hashByUser[this];
        userWithUrl = '<a href="' + JoinTables.userUrls[this] + '">' + this + '</a>';
        userLinks = JoinTables.concatenatedLinks(v.user);
        expertLinks = JoinTables.concatenatedLinks(v.expert);
        jQuery('.joinTable').append('<tr><td class="views-field">' + userWithUrl + '</td><td class="views-field">' + expertLinks + '</td><td class="views-field">' +  userLinks + '</td></tr>');
      }); // end loop over table
    }, // end function

    createAllSoftwareTable: function () {
      JoinTables.container().append('<div><table class="joinTable"><tr><th width="30%">Software</th><th width="30%">Power users</th><th width="30%">Other users</th></tr></table></div>');
      jQuery.each(Object.keys(JoinTables.hashBySoftware).sort(), function(k) {
        v = JoinTables.hashBySoftware[this];
        softwareWithUrl = '<a href="' + JoinTables.softwareUrls[this] + '">' + this + '</a>';
        userLinks = JoinTables.concatenatedLinks(v.user);
        expertLinks = JoinTables.concatenatedLinks(v.expert);
        jQuery('.joinTable').append('<tr><td class="views-field">' + softwareWithUrl + '</td><td class="views-field">' + expertLinks + '</td><td class="views-field">' + userLinks + "</td></tr>");
      }); // end loop over table
    } // end function
  }; // end return value
})(); // end "module"

/// On page load:
jQuery( document ).ready(function() {
  if (window.location.pathname != '/node/122' && window.location.pathname != '/node/123') {
    return;
  }

  JoinTables.populateSoftware();
  JoinTables.populatePowerUsers();
  JoinTables.populateUsers();

  if (window.location.pathname == '/node/122') {
    JoinTables.createAllSoftwareTable();
  }
  if (window.location.pathname == '/node/123') {
    JoinTables.createAllUsersTable();
  }
});