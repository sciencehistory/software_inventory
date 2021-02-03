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


      if (!JoinTables.joinHash.hasOwnProperty(person.innerHTML)) {
        JoinTables.joinHash[person.innerHTML] = { user: [], expert: [] };
      }
      JoinTables.joinHash[person.innerHTML][array_label].push([software.innerHTML, software.href]);


      if (!JoinTables.joinHash2.hasOwnProperty(software.innerHTML)) {
        JoinTables.joinHash2[software.innerHTML] = { user: [], expert: [] };
      }
      JoinTables.joinHash2[software.innerHTML][array_label].push([person.innerHTML, person.href]);
    });
  };

  return {

    joinHash: {},
    joinHash2: {},

    populateUsers: function () {
      rows = jQuery('div.view-users-hidden div.view-content table tbody tr');
      populate(rows, 'user');
    },
    populatePowerUsers: function () {
      rows = jQuery('div.view-power-users-hidden div.view-content table tbody tr');
      populate(rows, 'expert');
    },


    createAllUsersTable: function () {
      jQuery('div.region-content').prepend('<div><table class="all_users_table"><tr><th>Person</th><th>Expert user of</th><th>Also uses</th></tr></table></div>');
      jQuery.each(Object.keys(JoinTables.joinHash).sort(), function(k) {
        k = this;
        v = JoinTables.joinHash[k];
        user = [];
        expert = [];
        jQuery.each(v.user, function() {
          user.push('<a href="' + this[1]+'"> ' + this[0]+ '<a>');
        });
        jQuery.each(v.expert, function() {
          expert.push('<a href="' + this[1]+'"> ' + this[0]+ '<a>');
        });
        jQuery('.all_users_table').append("<tr><td>" + k + "</td><td>" + user + "</td><td>" + expert.join (", ") + "</td></tr>");
      });

    }, // end function

    createAllSoftwareTable: function () {
      jQuery('div.region-content').prepend('<div><table class="all_users_table"><tr><th>Software</th><th>Power users</th><th>Other users</th></tr></table></div>');
      jQuery.each(Object.keys(JoinTables.joinHash2).sort(), function(k) {
        k = this;
        v = JoinTables.joinHash2[k];
        user = [];
        expert = [];
        jQuery.each(v.user, function() {
          user.push('<a href="' + this[1]+'"> ' + this[0]+ '<a>');
        });
        jQuery.each(v.expert, function() {
          expert.push('<a href="' + this[1]+'"> ' + this[0]+ '<a>');
        });
        jQuery('.all_users_table').append("<tr><td>" + k + "</td><td>" + expert.join (", ") + "</td><td>" + user.join(", ") + "</td></tr>");
      });

    } // end function


  }; // end return value

})(); // end "module"

/// On page load:
jQuery( document ).ready(function() {
  JoinTables.populatePowerUsers();
  JoinTables.populateUsers();
  // JoinTables.createAllUsersTable()
  JoinTables.createAllSoftwareTable()
});