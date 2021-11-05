(function($) {

    var Alpaca = $.alpaca;

    if (!Alpaca.Fields) {
        Alpaca.Fields = {};
    }

    Alpaca.Fields.TMobileNodePickerField = Alpaca.Fields.AbstractGitanaPickerField.extend(
    /**
     * @lends Alpaca.Fields.TMobileNodePickerField.prototype
     */
    {
        launchModal: function(field, el, callback)
        {
            var self = this;

            // component field on tmobile:page
            if (self.name == "component" && self.options.picker) {
                var id = self.top().getControlByPath('category') ? self.top().getControlByPath('category').getValue() : null;
                if (id)
                {
                    // var ids = [];
                    // id.forEach(element => {
                    //     ids.push(element.id);
                    // });

                    self.options.picker.query = {
                        _type: "tmobile:component",
                        "componentType": {
                            "$in": ["reusable"]
                        }
                    };
                }
            }

            self.base(field, el, callback);
        },

        getFieldType: function()
        {
            return "tmobile-node-picker";
        },

        pickerConfiguration: function()
        {
            return {
                "title": "Select a Node",
                "type": "gitana-node-picker"
            };
        },

        getTitle: function() {
            return "Node Picker Field";
        },

        getDescription: function() {
            return "Field for selecting nodes";
        }
    });


    Alpaca.registerFieldClass("tmobile-node-picker", Alpaca.Fields.TMobileNodePickerField);

})(jQuery);
