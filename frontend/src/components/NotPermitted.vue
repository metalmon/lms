<template>
	<div class="text-base border rounded-md w-1/3 mx-auto my-32">
		<div class="border-b px-5 py-3 font-medium">
			<span
				class="inline-flex items-center before:bg-red-600 before:w-2 before:h-2 before:rounded-md before:mr-2"
			></span>
			{{ title }}
		</div>
		<div class="px-5 py-3">
			<div class="mb-4 leading-6">
				{{ text }}
			</div>
			<Button variant="solid" class="w-full" @click="redirect()">
				{{ buttonLabel }}
			</Button>
		</div>
	</div>
</template>
<script setup>
import { Button } from 'frappe-ui'

const props = defineProps({
	title: {
		type: String,
		default: __('Not Permitted'),
	},
	text: {
		type: String,
		default: __('You are not permitted to access this page.'),
	},
	buttonLabel: {
		type: String,
		default: __('Login'),
	},
	buttonLink: {
		type: String,
		default: '/login',
	},
})

const redirect = () => {
	window.location.href = props.buttonLink
}
</script>
