<template>
	<Dialog v-model="show" :options="{ size: '5xl' }">
		<template #body>
			<div class="flex h-[calc(100vh_-_8rem)]">
				<div class="flex w-52 shrink-0 flex-col bg-surface-gray-2 p-2">
					<h1 class="mb-3 px-2 pt-2 text-lg font-semibold text-ink-gray-9">
						{{ __('Settings') }}
					</h1>
					<div v-for="tab in tabs" :key="tab.label">
						<div
							v-if="!tab.hideLabel"
							class="mb-2 mt-3 flex cursor-pointer gap-1.5 px-1 text-base font-medium text-ink-gray-5 transition-all duration-300 ease-in-out"
						>
							<span>{{ tab.label }}</span>
						</div>
						<nav class="space-y-1">
							<SidebarLink
								v-for="item in tab.items"
								:link="item"
								:key="item.label"
								class="w-full"
								:class="
									activeTab?.label == item.label
										? 'bg-surface-selected shadow-sm'
										: 'hover:bg-surface-gray-2'
								"
								@click="activeTab = item"
							/>
						</nav>
					</div>
				</div>
				<div
					v-if="activeTab && data.doc"
					:key="activeTab.label"
					class="flex flex-1 flex-col px-10 py-8 bg-surface-modal"
				>
					<component
						v-if="activeTab.template"
						:is="activeTab.template"
						v-bind="{
							label: activeTab.label,
							description: activeTab.description,
							...(activeTab.label === __('Branding')
								? { fields: activeTab.fields }
								: {}),
						}"
					/>
					<PaymentSettings
						v-else-if="activeTab.label === __('Payment Gateway')"
						:label="activeTab.label"
						:description="activeTab.description"
						:data="data"
						:fields="activeTab.fields"
					/>
					<SettingDetails
						v-else
						:fields="activeTab.fields"
						:label="activeTab.label"
						:description="activeTab.description"
						:data="data"
					/>
				</div>
			</div>
		</template>
	</Dialog>
</template>
<script setup>
import { Dialog, createDocumentResource } from 'frappe-ui'
import { computed, markRaw, ref, watch } from 'vue'
import { useSettings } from '@/stores/settings'
import SettingDetails from '@/components/Settings/SettingDetails.vue'
import SidebarLink from '@/components/SidebarLink.vue'
import Members from '@/components/Settings/Members.vue'
import Evaluators from '@/components/Settings/Evaluators.vue'
import Categories from '@/components/Settings/Categories.vue'
import EmailTemplates from '@/components/Settings/EmailTemplates.vue'
import BrandSettings from '@/components/Settings/BrandSettings.vue'
import PaymentSettings from '@/components/Settings/PaymentSettings.vue'
import ZoomSettings from '@/components/Settings/ZoomSettings.vue'
import Badges from '@/components/Settings/Badges.vue'

const show = defineModel()
const doctype = ref('LMS Settings')
const activeTab = ref(null)
const settingsStore = useSettings()

const data = createDocumentResource({
	doctype: doctype.value,
	name: doctype.value,
	fields: ['*'],
	cache: doctype.value,
	auto: true,
})

const tabsStructure = computed(() => {
	return [
		{
			label: __('Settings'),
			hideLabel: true,
			items: [
				{
					label: __('General'),
					icon: 'Wrench',
					fields: [
						{
							label: __('Allow Guest Access'),
							name: 'allow_guest_access',
							description:
								__('If enabled, users can access the course and batch lists without logging in.'),
							type: 'checkbox',
						},
						{
							label: __('Enable Learning Paths'),
							name: 'enable_learning_paths',
							description:
								__('This will ensure students follow the assigned programs in order.'),
							type: 'checkbox',
						},
						{
							label: __('Prevent Skipping Videos'),
							name: 'prevent_skipping_videos',
							type: 'checkbox',
							description:
								__('If enabled, users will no able to move forward in a video'),
						},
						{
							label: __('Send calendar invite for evaluations'),
							name: 'send_calendar_invite_for_evaluations',
							description:
								__('If enabled, it sends google calendar invite to the student for evaluations.'),
							type: 'checkbox',
						},
						{
							type: 'Column Break',
						},
						{
							label: __('Livecode URL'),
							name: 'livecode_url',
							doctype: 'Livecode URL',
							type: 'text',
							description:
								__('https://docs.frappe.io/learning/falcon-self-hosting-guide'),
						},
						{
							label: __('Batch Confirmation Email Template'),
							name: 'batch_confirmation_template',
							doctype: 'Email Template',
							type: 'Link',
						},
						{
							label: __('Certification Email Template'),
							name: 'certification_template',
							doctype: 'Email Template',
							type: 'Link',
						},
						{
							label: __('Unsplash Access Key'),
							name: 'unsplash_access_key',
							description:
								__('Allows users to pick a profile cover image from Unsplash. https://unsplash.com/documentation#getting-started.'),
							type: 'password',
						},
					],
				},
			],
		},
		{
			label: __('Settings'),
			hideLabel: true,
			items: [
				{
					label: __('Payment Gateway'),
					icon: 'DollarSign',
					description:
						__('Configure the payment gateway and other payment related settings'),
					fields: [
						{
							label: __('Default Currency'),
							name: 'default_currency',
							type: 'Link',
							doctype: 'Currency',
						},
						{
							label: __('Payment Gateway'),
							name: 'payment_gateway',
							type: 'Link',
							doctype: 'Payment Gateway',
						},
						{
							type: 'Column Break',
						},
						{
							label: __('Apply GST for India'),
							name: 'apply_gst',
							type: 'checkbox',
						},
						{
							label: __('Show USD equivalent amount'),
							name: 'show_usd_equivalent',
							type: 'checkbox',
						},
						{
							label: __('Apply rounding on equivalent'),
							name: 'apply_rounding',
							type: 'checkbox',
						},
					],
				},
			],
		},
		{
			label: __('Lists'),
			hideLabel: false,
			items: [
				{
					label: __('Members'),
					description:
						__('Add new members or manage roles and permissions of existing members'),
					icon: 'UserRoundPlus',
					template: markRaw(Members),
				},
				{
					label: __('Evaluators'),
					description: '',
					icon: 'UserCheck',
					description:
						__('Add new evaluators or check the slots existing evaluators'),
					template: markRaw(Evaluators),
				},
				{
					label: __('Zoom Accounts'),
					description:
						__('Manage zoom accounts to conduct live classes from batches'),
					icon: 'Video',
					template: markRaw(ZoomSettings),
				},
				{
					label: __('Badges'),
					description:
						__('Create badges and assign them to students to acknowledge their achievements'),
					icon: 'Award',
					template: markRaw(Badges),
				},
				{
					label: __('Categories'),
					description: __('Double click to edit the category'),
					icon: 'Network',
					template: markRaw(Categories),
				},
				{
					label: __('Email Templates'),
					description: __('Manage the email templates for your learning system'),
					icon: 'MailPlus',
					template: markRaw(EmailTemplates),
				},
			],
		},
		{
			label: __('Customize'),
			hideLabel: false,
			items: [
				{
					label: __('Branding'),
					icon: 'Blocks',
					template: markRaw(BrandSettings),
					fields: [
						{
							label: __('Brand Name'),
							name: 'app_name',
							type: 'text',
						},
						{
							label: __('Logo'),
							name: 'banner_image',
							type: 'Upload',
						},
						{
							label: __('Favicon'),
							name: 'favicon',
							type: 'Upload',
						},
					],
				},
				{
					label: __('Sidebar'),
					icon: 'PanelLeftIcon',
					description: __('Choose the items you want to show in the sidebar'),
					fields: [
						{
							label: __('Courses'),
							name: 'courses',
							type: 'checkbox',
						},
						{
							label: __('Batches'),
							name: 'batches',
							type: 'checkbox',
						},
						{
							label: __('Programming Exercises'),
							name: 'programming_exercises',
							type: 'checkbox',
						},
						{
							label: __('Certified Members'),
							name: 'certified_members',
							type: 'checkbox',
						},
						{
							type: 'Column Break',
						},
						{
							label: __('Jobs'),
							name: 'jobs',
							type: 'checkbox',
						},
						{
							label: __('Statistics'),
							name: 'statistics',
							type: 'checkbox',
						},
						{
							label: __('Notifications'),
							name: 'notifications',
							type: 'checkbox',
						},
					],
				},
				{
					label: __('Signup'),
					icon: 'LogIn',
					fields: [
						{
							label: __('Identify User Category'),
							name: 'user_category',
							type: 'checkbox',
							description:
								__('Enable this option to identify the user category during signup.'),
						},
						{
							label: __('Disable signup'),
							name: 'disable_signup',
							type: 'checkbox',
							description:
								__('New users will have to be manually registered by Admins.'),
						},
						{
							type: 'Column Break',
						},
						{
							label: __('Signup Consent HTML'),
							name: 'custom_signup_content',
							type: 'Code',
							mode: 'htmlmixed',
							rows: 10,
						},
					],
				},
				{
					label: __('SEO'),
					icon: 'Search',
					fields: [
						{
							label: __('Meta Description'),
							name: 'meta_description',
							type: 'textarea',
							rows: 4,
							description:
								__("This description will be shown on lists and pages that don't have meta description"),
						},
						{
							label: __('Meta Keywords'),
							name: 'meta_keywords',
							type: 'textarea',
							rows: 4,
							description:
								__('Comma separated keywords for search engines to find your website.'),
						},
						{
							type: 'Column Break',
						},
						{
							label: __('Meta Image'),
							name: 'meta_image',
							type: 'Upload',
							size: 'lg',
						},
					],
				},
			],
		},
	]
})

const tabs = computed(() => {
	return tabsStructure.value.map((tab) => {
		return {
			...tab,
			items: tab.items.filter((item) => {
				return !item.condition || item.condition()
			}),
		}
	})
})

watch(show, async () => {
	if (show.value) {
		const currentTab = await tabs.value
			.flatMap((tab) => tab.items)
			.find((item) => item.label === settingsStore.activeTab)
		activeTab.value = currentTab || tabs.value[0].items[0]
	} else {
		activeTab.value = null
		settingsStore.isSettingsOpen = false
	}
})
</script>
