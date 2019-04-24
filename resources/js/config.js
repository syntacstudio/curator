/* handle global variabe */
let chair_base_data = [];

const db = {
	// get chair data 
    chair : function() {
        if (chair_base_data.length < 1) {
            $.ajax({
                    url: "storages/data/chair.json",
                    type: 'GET',
                    async: false, 
                    dataType: 'json',
                })
                .done(function(result) {
                    chair_base_data.push(result)
                })
        }
        data = chair_base_data[0];

        return data;
    }
}