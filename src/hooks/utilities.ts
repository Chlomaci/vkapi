import {IDuplicate} from "@/types/types";

export function chunkArray(array, chunk) {
  const newArray = [];
  for (let i = 0; i < array.length; i += chunk) {
    newArray.push(array.slice(i, i + chunk));
  }
  return newArray;
}

export function getDuplicates(array: string[]) {
  const countItems = {};
  for (const item of array) {
    countItems[item] = countItems[item] ? countItems[item] + 1 : 1;
  }
  const duplicateIdsStr = Object.keys(countItems).filter((item) => countItems[item] > 1);

  const duplicates = {};
  for (const key in countItems){
    if (duplicateIdsStr.includes(key)){
      duplicates[key] = countItems[key];
    }
  }
  const duplicateIds = duplicateIdsStr.map(i => Number(i))

  return {duplicates, duplicateIds}
}

export function removeDuplicates(friends: number[], duplicates: number[]){
  const friendsWithoutDuplicates = friends.filter(e => (!duplicates.includes(e)));
  const result = friendsWithoutDuplicates.concat(duplicates)
  return result;
}

export function checkDuplicate(duplicates: IDuplicate[], id: string){
  if (duplicates.hasOwnProperty(id)){
    return duplicates[id]
  } return
}

export function getAge(bdate) {
  let today = new Date();
  const birthday = new Date(bdate[2], +bdate[1] - 1, bdate[0]);
  let age = today.getFullYear() - birthday.getFullYear();

  let m = today.getMonth() - birthday.getMonth();
  let d = today.getDay() - birthday.getDay();

  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  if ( age === 0 ) {
    m = 12 + m;
    if (d < 0 || (d === 0 && today.getDate() < birthday.getDate())) {
      m--;
    }
  }

  return age
}

export function promiseAllTimeout(promises, timeout, resolvePartial=true) {
  return new Promise(function(resolve, reject) {
    let results = [],
      finished = 0,
      numPromises = promises.length;
    let onFinish = function() {
      if (finished < numPromises) {
        if (resolvePartial) {
          (resolve)(results);
        } else {
          throw new Error("Not all promises completed within the specified time");
        }
      } else {
        (resolve)(results);
      }
      onFinish = null;
    };
    for (let i = 0; i < numPromises; i += 1) {
      results[i] = undefined;
      promises[i].then(
        function(res) {
          results[i] = res;
          finished += 1;
          if (finished === numPromises && onFinish) {
            onFinish();
          }
        },
        reject
      );
    }
    setTimeout(function() {
      if (onFinish) {
        onFinish();
      }
    }, timeout);
  });
}
