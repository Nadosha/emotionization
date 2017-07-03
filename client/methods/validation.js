$.validator.addMethod('bookIsUnique', function( title ){
	var exist = Emotions.findOne({'name': title}, {fields: {'name': 1}});
	return exist ? false : true;
});
