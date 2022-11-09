
  const arr = [
    {
      namee:'John',
      age:18,
    },
    {
      name:'Paul',
      age:23,
    },
  ];
  function getYourDataFromResource() {
    return arr.pop();
  }

  function showName(name){
    if (name.length<10) {
      console.error( "a short name", name );
    } else {
      console.error( "a long name", name );
    }
  }
  function showAge(age){
    console.error( age );
  }
  function foo(guy) {
    showName(guy.name);
    showAge(guy.age);
  }

  // then, you have some data:
  const guy1 = getYourDataFromResource('john');
  const guy2 = getYourDataFromResource('paul');

  // then, you want to exec some procedures with your data:
  foo(guy1)
  foo(guy2);

