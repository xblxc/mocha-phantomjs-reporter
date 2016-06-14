var expect = chai.expect;

describe('test num-picker', function() {
  $('.add-btn').click();
  it('when add-btn clicked', function(){
    expect($('.input').val()).to.equal('2');
  });
});

