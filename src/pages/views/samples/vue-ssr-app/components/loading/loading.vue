<script>
import waiting from '../waiting/waiting.vue';

export default {
  extends: waiting,
  props: {
    bgColor: {
      type: String,
      default: '#fff'
    }
  },
};
</script>
