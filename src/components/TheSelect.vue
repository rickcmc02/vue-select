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
        <!-- <option
          v-for="option in group.options"
          :key="option"
          :disabled="checkNums(option, idx) === 0"
          :value="option"
        >
          {{ option }}
          {{ checkNums(option, idx) ? `${checkNums(option, idx)}` : "(품절)" }}
        </option> -->
        <option v-for="option in group.options" :key="option" :value="option">
          {{ option }}
          {{ checkNums(option, idx) ? `${checkNums(option, idx)}` : "(품절)" }}
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
const preSelectedList = ref(selectData.countList);
const leftNumber = ref(0);

const selectHandler = (selected, level) => {
  let tmpSelected = selectedOptions.value;
  if (tmpSelected.length === level) {
    tmpSelected.push(selected);
  } else if (tmpSelected.length > level) {
    tmpSelected[level] = selected;
    tmpSelected.slice(0, level + 1);
  } else {
    alert("선택 오류입니다.");
  }
  selectedOptions.value = tmpSelected;
};

const checkNums = (option, level) => {
  let remainCnt = 0;
  let tmpPreSel = preSelectedList.value;

  return remainCnt;
};

let defDict = { value: 0 };
selectData.groupList.reverse().forEach((group) => {
  let newDict = {};
  group.options.forEach((option) => {
    newDict[option] = { ...defDict };
  });
  defDict = { ...newDict, value: 0 }; // 1 depth 까지만 깊은복사가 되는 문제
});
console.log(defDict);
defDict = JSON.parse(JSON.stringify(defDict)); // 임시로 JSON 함수 이용한 deepcopy... 왜 안되지?

selectData.countList.forEach((count) => {
  let tmpCombi = count.combination;
  let tmpCnt = count.remainCount;
  let pastInnerDict = defDict;
  for (let level = 0; level < tmpCombi.length; level++) {
    pastInnerDict.value += tmpCnt;
    let tmpCondition = tmpCombi[level];
    pastInnerDict = pastInnerDict[tmpCondition];
    pastInnerDict.value += tmpCnt;
  }
});
console.log(defDict);

// filter 함수로, 하나씩 추가
// include 함수로, 통으로 비교?
// 중간에 중간 옵션 바꿀 경우에도 바뀌어야지... 위에 옵션 바꾸면 그 아래 옵션 취소되어야 하나?
</script>