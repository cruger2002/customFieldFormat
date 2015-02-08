$.fn.customFieldFormat = function (options) {
    var $this = $(this);
    if(!$this.length)
        return false;
    
    var fields = [];

    var defaults = {
        fields: [
            {
                rules: /[^0-9]/g,
                htmlOptions: {
                    maxlength: 2,
                    class: 'zip1'
                }
            },
            {
                rules: /[^0-9]/g,
                htmlOptions: {
                    maxlength: 3,
                    class: 'zip2'
                }
            }
        ],
        divider: '-'
    };

    var config = $.extend(defaults, options);

    var init = function () {
        $this.attr('type', 'hidden');
        draw();
    }

    var draw = function () {
        var values = [];
        var initValues = function (i) {
            values[i] = readField(getLength(i), config.fields[i].htmlOptions.maxlength);
            function getLength(i) {
                var n=0;
                for(var x=0;x<i;x++)
                    n+=config.fields[x].htmlOptions.maxlength+config.divider.length;
                return n;
            };

            function readField(start, length) {
                var value = $this.val();
                return value.substr(start, length);
            };
        };        

        for (var i in config.fields) {
            var htmlOptions = [];
            if (config.fields[i].htmlOptions != undefined) {
                for (var n in config.fields[i].htmlOptions)
                    htmlOptions.push(n + '="' + config.fields[i].htmlOptions[n] + '"');
            }
            var match = config.fields[i].rules;

            (function (x) { 
                var index = x;
                initValues(index);
                fields.push($('<input type="text" ' + htmlOptions.join(' ') + ' value="'+values[index]+'">').on('keydown', function (e) {
                    // Allow: backspace, delete, tab, escape, enter, ctrl+A and .
                    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                            // Allow: Ctrl+A
                                    (e.keyCode == 65 && e.ctrlKey === true) ||
                                    // Allow: home, end, left, right
                                            (e.keyCode >= 35 && e.keyCode <= 39)) {
                                // let it happen, don't do anything
                                return;
                            }
                            if (String.fromCharCode(e.keyCode).match(match))
                                return false;


                        }).on('keyup', function () {
                    values[index] = $(this).val();
                    $this.trigger('update');
                }));
 
            })(i);

        }
        fields = fields.reverse();
        if (typeof $this.get(0) != 'undefined')
            $this.replaceWith($this.get(0).outerHTML + fields.map(function (item) {
                $this.after(item);
            }).join(''));

        $this.on('update', function () {
            var id = $this.attr('id');
            $('#' + id).val(values.join(config.divider));
        });
 
    }

    init();
}
