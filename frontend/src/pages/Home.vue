<template>
	<div class="max-w-3xl py-12 mx-auto">
		<Button
			icon-left="code"
			@click="$resources.ping.fetch"
			:loading="$resources.ping.loading"
		>
			{{ __('Click to send ping request') }}
		</Button>
		<div>
			{{ $resources.ping.data }}
		</div>
		<pre>{{ $resources.ping }}</pre>

		<Button @click="showDialog = true">{{ __('Open Dialog') }}</Button>
		<Dialog title="Title" v-model="showDialog"> {{ __('Dialog content') }} </Dialog>
	</div>
</template>

<script>
import { Dialog } from 'frappe-ui'

export default {
	name: 'Home',
	data() {
		return {
			showDialog: false,
		}
	},
	resources: {
		ping: {
			url: 'ping',
		},
	},
	components: {
		Dialog,
	},
}
</script>
