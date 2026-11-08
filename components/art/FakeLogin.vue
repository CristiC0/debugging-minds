<script setup lang="ts">
// Q: Phishing. A university login page that looks right, on a lookalike address:
// the deceptive part of the URL gets a crimson underline on slide enter.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
</script>

<template>
  <div class="win" :class="{ on: active }">
    <div class="bar">
      <ph-lock-simple-bold class="lock" />
      <span class="url">https://usm-md.<span class="bad">secure-login.xyz</span>/auth</span>
    </div>
    <div class="form">
      <div class="brand dm-display">USM</div>
      <span class="en">Sign in</span>
      <label class="field">
        <span class="en">Username</span>
        <span class="box mono">student@usm.md</span>
      </label>
      <label class="field">
        <span class="en">Password</span>
        <span class="box mono">••••••••<span class="cur" /></span>
      </label>
      <span class="btn"><span class="en">Log in</span></span>
    </div>
  </div>
</template>

<style scoped>
.win { border: 2.5px solid var(--dm-ink); }
.bar { display: flex; align-items: center; gap: .35rem; padding: .35rem .45rem; border-bottom: 2.5px solid var(--dm-ink); background: var(--dm-paper-2); }
.lock { flex: none; font-size: .7rem; }
.url { font-family: var(--dm-mono); font-size: .56rem; font-weight: 600; white-space: nowrap; overflow: hidden; }
.bad { position: relative; }
.bad::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -3px; height: 3px; background: var(--dm-red);
  transform: scaleX(0); transform-origin: left; transition: transform .7s var(--dm-ease) .5s;
}
.on .bad::after { transform: scaleX(1); }
.form { display: flex; flex-direction: column; gap: .45rem; padding: .6rem .7rem .7rem; }
.brand { font-size: 1.5rem; line-height: .85; letter-spacing: -.04em; }
.form :deep(.ro) { font-size: .66rem; } .form :deep(.ru) { font-size: .6rem; }
.field { display: flex; flex-direction: column; gap: .15rem; }
.box { border: 2px solid var(--dm-ink); padding: .25rem .35rem; font-size: .6rem; display: flex; align-items: center; }
.mono { font-family: var(--dm-mono); }
.cur { width: 2px; height: .7rem; background: var(--dm-ink); margin-left: 2px; animation: dm-pulse 1s steps(1) infinite; }
.btn { align-self: flex-start; background: var(--dm-ink); padding: .25rem .6rem; }
.btn :deep(.ro), .btn :deep(.ru), .btn :deep(.dot) { color: var(--dm-white); }
.en { font-size: .66rem; font-weight: 700; }
.btn .en { color: var(--dm-white); }
</style>
