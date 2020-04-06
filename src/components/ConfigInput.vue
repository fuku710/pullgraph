<template>
  <div>
    <div class="access-token">
      <label>アクセストークン</label>
      <input :value="token" @input="e => $emit('inputToken', e.target.value)" />
    </div>
    <div class="repos">
      <label>レポジトリ</label>
      <button @click="$emit('clickAddRepo')">追加</button>
      <div v-for="(repo, index) in repos" :key="index">
        <input
          :value="repo"
          @input="e => $emit('inputRepo', e.target.value, index)"
        />
        <button @click="$emit('clickRemoveRepo', index)">X</button>
      </div>
    </div>
    <div class="author">
      <label>作成者</label>
      <input
        :value="author"
        @input="e => $emit('inputAuthor', e.target.value)"
      />
    </div>
    <div class="date">
      <label>期間</label>
      <div>
        <input
          :value="beginDate"
          @input="e => $emit('inputBeginDate', e.target.value)"
        />
        ~
        <input
          :value="endDate"
          @input="e => $emit('inputEndDate', e.target.value)"
        />
      </div>
    </div>
    <button @click="$emit('clickSave')">保存</button>
  </div>
</template>
<script>
export default {
  props: {
    token: { type: String, required: false },
    repos: { type: Array, required: false },
    author: { type: String, required: true },
    beginDate: { type: String, required: false },
    endDate: { type: String, required: false }
  }
}
</script>