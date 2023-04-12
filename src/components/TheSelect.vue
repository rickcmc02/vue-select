<template>
  <section id="select-section">
    <div v-for="(group, idx) in selectData?.groupList" :key="group?.title">
      <select
        v-if="group"
        :name="group.title"
        :disabled="idx > selectedOptions.length"
        class="select-group"
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
          {{ checkNums(option, idx) === 0
            ? "(품절)"
            : idx === selectData.groupList?.length - 1
            ? `(${checkNums(option, idx)}개 구매가능)`
            : ""}}
        </option>
      </select>
    </div>
  </section>
</template>

<script>
export default {
  name: "component-TheSelect",
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import { getSizeColorOptions } from "../api/index";

const props = defineProps({
  category: {
    Type: String,
    default: "",
  }
})

const resultData = await getSizeColorOptions(props.category);
const selectData = resultData?.data;

const selectedOptions = ref([]);
const leftNumber = ref(0);

// set Base Group Dictionary
let defDict = { count: 0 };
[...selectData.groupList].reverse().forEach((group) => {
  let newDict = {};
  group.options.forEach((option) => {
    newDict[option] = { ...defDict };
  });
  defDict = { ...newDict, count: 0 };
});

const deepCopyObject = (obj) => {
  let clone = {};
  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      clone[key] = deepCopyObject(obj[key]);
    } else {
      clone[key] = obj[key];
    }
  }
  return clone;
};
defDict = deepCopyObject(defDict);

// add count to base group dictionary
selectData.countList.forEach((count) => {
  let tmpCombi = count.combination;
  let tmpCnt = count.remainCount;
  let pastInnerDict = defDict;
  for (let level = 0; level < tmpCombi.length; level++) {
    pastInnerDict.count += tmpCnt;
    let tmpCondition = tmpCombi[level];
    pastInnerDict = pastInnerDict[tmpCondition];
    if (level === tmpCombi.length - 1) {
      pastInnerDict.count = tmpCnt;
    }
  }
});

// check count for each options
const checkNums = (option, level) => {
  let remainCnt = 0;
  let tmpSelected = defDict;
  let tmpSelOps = selectedOptions.value;
  if (tmpSelOps.length >= level) {
    for (let l = 0; l < level; l++) {
      tmpSelected = tmpSelected[tmpSelOps[l]];
    };
    remainCnt = tmpSelected[option]?.count;
  }
  return remainCnt;
};

// handling select change
const selectHandler = (selected, level) => {
  let tmpSelOps = selectedOptions.value;
  let tmpSelected = selected.target.value;
  if (tmpSelOps.length > level) tmpSelOps = tmpSelOps.slice(0, level);
  tmpSelOps.push(tmpSelected);
  selectedOptions.value = tmpSelOps;
};
</script>

<style>
#select-section {
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.select-group {
  width: 160px;
  height: 32px;
  margin: 8px 0;
}
</style>