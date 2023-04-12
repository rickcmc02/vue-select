<template>
  <div>
    <div v-for="(group, idx) in selectData?.groupList" :key="group?.title">
      <select
        v-if="group"
        :name="group.title"
        :disabled="idx > selectedOptions.length"
        @change="($event) => selectHandler($event, idx)"
      >
        <option disabled selected>{{ group.title }}</option>
        <option
          v-for="option in group.options"
          :key="option"
          :disabled="checkNums(option, idx) === 0"
          :value="option"
        >
          {{ option }}
          {{ checkNums(option, idx) === 0 ? "(품절)" : ""}}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "component-TheSelect",
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import { getSizeColorOptions } from "../api/index";
const resultData = await getSizeColorOptions();
const selectData = resultData?.data;

const selectedOptions = ref([]);
const leftNumber = ref(0);

// set Base Group Dictionary
let defDict = { value: 0 };
[...selectData.groupList].reverse().forEach((group) => {
  let newDict = {};
  group.options.forEach((option) => {
    newDict[option] = { ...defDict };
  });
  defDict = { ...newDict, value: 0 };
});

// add value to Base Group Dictionary
selectData.countList.forEach((count) => {
  let tmpCombi = count.combination;
  let tmpCnt = count.remainCount;
  let pastInnerDict = defDict;
  for (let level = 0; level < tmpCombi.length; level++) {
    pastInnerDict.value += tmpCnt;
    let tmpCondition = tmpCombi[level];
    pastInnerDict = pastInnerDict[tmpCondition];
  }
});

// check value for each options
const checkNums = (option, level) => {
  let remainCnt = 0;
  let tmpSelected = defDict;
  let tmpSelOps = selectedOptions.value;
  if (tmpSelOps.length >= level) {
    for (let l = 0; l < level; l++) {
      tmpSelected = tmpSelected[tmpSelOps[l]];
    };
    remainCnt = tmpSelected[option]?.value;
  }
  return remainCnt;
};

// handling select change
const selectHandler = (selected, level) => {
  let tmpSelOps = selectedOptions.value;
  let tmpSelected = selected.target.value;
  if (tmpSelOps.length === level) {
    tmpSelOps.push(tmpSelected);
  } else if (tmpSelOps.length > level) {
    tmpSelOps[level] = tmpSelected;
    tmpSelOps.slice(0, level + 1);
  } else {
    alert("선택 오류입니다.");
  }
  selectedOptions.value = tmpSelOps;
};
</script>