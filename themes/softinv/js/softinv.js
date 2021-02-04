var JoinTables = (function () {
  // private
  populate = function(rows, array_label) {
    var person, software;
    rows.each(function( index ) {
      person = jQuery(this).find('td a')[0]
      software = jQuery(this).find('td a')[1];
      if (software == undefined) {
        return;
      }

      JoinTables.userUrls[person.innerHTML]       = person.href;
      JoinTables.softwareUrls[software.innerHTML] = software.href;

      if (!JoinTables.hashByUser.hasOwnProperty(person.innerHTML)) {
        JoinTables.hashByUser[person.innerHTML] = { user: [], expert: [] };
      }
      JoinTables.hashByUser[person.innerHTML][array_label].push([software.innerHTML, software.href]);

      if (!JoinTables.hashBySoftware.hasOwnProperty(software.innerHTML)) {
        JoinTables.hashBySoftware[software.innerHTML] = { user: [], expert: [] };
      }
      JoinTables.hashBySoftware[software.innerHTML][array_label].push([person.innerHTML, person.href]);
    });
  };

  return {

    hashByUser: {},
    hashBySoftware: {},
    userUrls: {},
    softwareUrls: {},

    populateUsers: function () {
      rows = jQuery('div.view-users-hidden div.view-content table tbody tr');
      populate(rows, 'user');
    },
    populatePowerUsers: function () {
      rows = jQuery('div.view-power-users-hidden div.view-content table tbody tr');
      populate(rows, 'expert');
    },


    createAllUsersTable: function () {
      jQuery('div.block-system-main-block div.content').append('<div><table class="all_users_table"><tr><th>Person</th><th>Expert user of</th><th>Also uses</th></tr></table></div>');
      jQuery.each(Object.keys(JoinTables.hashByUser).sort(), function(k) {
        v = JoinTables.hashByUser[this];
        user_with_url = '<a href="' + JoinTables.userUrls[this] + '">' + this + '</a>'
        user = [];
        expert = [];
        jQuery.each(v.user, function() {
          user.push('<a href="' + this[1]+'"> ' + this[0]+ '<a>');
        });
        jQuery.each(v.expert, function() {
          expert.push('<a href="' + this[1]+'"> ' + this[0]+ '<a>');
        });
        jQuery('.all_users_table').append("<tr><td>" + user_with_url + "</td><td>" + user.join (", ") + "</td><td>" + expert.join (", ") + "</td></tr>");
      });

    }, // end function

    createAllSoftwareTable: function () {
      jQuery('div.block-system-main-block div.content').append('<div><table class="all_software_table"><tr><th>Software</th><th>Power users</th><th>Other users</th></tr></table></div>');
      jQuery.each(Object.keys(JoinTables.hashBySoftware).sort(), function(k) {
        software_with_url = '<a href="' + JoinTables.softwareUrls[this] + '">' + this + '</a>';
        v = JoinTables.hashBySoftware[this];
        user = [];
        expert = [];
        jQuery.each(v.user, function() {
          user.push('<a href="' + this[1]+'"> ' + this[0]+ '<a>');
        });
        jQuery.each(v.expert, function() {
          expert.push('<a href="' + this[1]+'"> ' + this[0]+ '<a>');
        });
        jQuery('.all_software_table').append('<tr><td>' + software_with_url + '</td><td>' + expert.join (", ") + "</td><td>" + user.join(", ") + "</td></tr>");
      });

    } // end function


  }; // end return value

})(); // end "module"

/// On page load:
jQuery( document ).ready(function() {
  if (window.location.pathname != '/node/122' && window.location.pathname != '/node/123') {
    return;
  }
  JoinTables.populatePowerUsers();
  JoinTables.populateUsers();
  if (window.location.pathname == '/node/122') {
    JoinTables.createAllSoftwareTable();
  }
  if (window.location.pathname == '/node/123') {
    JoinTables.createAllUsersTable();
  }
});