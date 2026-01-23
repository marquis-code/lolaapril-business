
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b-[0.5px] border-gray-100 z-10 flex-shrink-0 safe-area-top"
      >
        <div
          class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between max-w-7xl mx-auto"
        >
          <button
            v-if="currentStep > 1"
            @click="goBack"
            class="p-2 hover:bg-gray-100 bg-gray-50 rounded-full transition flex-shrink-0 -ml-2"
          >
            <svg
              class="w-3 h-3 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div v-else class="w-9 sm:w-10 flex-shrink-0"></div>

          <div
            class="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-sm flex-1 justify-center px-2"
          >
            <span
              :class="
                currentStep >= 1
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-400'
              "
              >Services</span
            >
            <span class="text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path
                  d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"
                ></path>
              </svg>
              <!-- <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H128a88.1,88.1,0,0,0-88,88,8,8,0,0,1-16,0A104.11,104.11,0,0,1,128,96h76.69L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66Z"></path></svg> -->
            </span>
            <span
              :class="
                currentStep >= 2
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-400'
              "
              >Time</span
            >
            <span class="text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path
                  d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"
                ></path>
              </svg>
              <!-- <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H128a88.1,88.1,0,0,0-88,88,8,8,0,0,1-16,0A104.11,104.11,0,0,1,128,96h76.69L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66Z"></path></svg> -->
            </span>
            <span
              :class="
                currentStep >= 3
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-400'
              "
              >Confirm</span
            >
          </div>

          <button
            @click="closeModal"
            class="p-2 border-b-[0.5px] border-gray-200 bg-gray-50 rounded-full transition flex-shrink-0 -mr-2"
          >
            <svg
              class="w-3 h-3 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-hidden">
        <div class="max-w-7xl mx-auto h-full">
          <div class="lg:grid lg:grid-cols-3 lg:gap-8 lg:p-6 h-full">
            <!-- Left Content - Scrollable -->
            <div
              class="lg:col-span-2 p-4 sm:p-6 lg:p-0 pb-32 lg:pb-6 h-full overflow-y-auto"
              ref="leftContentRef"
            >
              <!-- Step 1: Services -->
              <!-- Step 1: Services -->
              <div v-show="currentStep === 1">
                <!-- Header -->
                <h1
                  class="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2"
                >
                  Services
                </h1>

                <p class="text-sm sm:text-base text-gray-600 mb-6">
                  Choose the services you'd like to book
                </p>

                <!-- ===================== -->
                <!-- 1️⃣ LOADING STATE -->
                <!-- ===================== -->
                <template v-if="isLoadingServices">
                  <p class="text-sm text-gray-500 mb-6">
                    Preparing a relaxing experience for you…
                  </p>

                  <!-- Category skeleton -->
                  <div class="flex gap-2 mb-6 overflow-x-auto">
                    <div
                      v-for="i in 5"
                      :key="i"
                      class="h-9 w-24 rounded-full bg-gray-100 animate-pulse"
                    />
                  </div>

                  <!-- Service card skeleton -->
                  <div class="space-y-4">
                    <div
                      v-for="i in 6"
                      :key="i"
                      class="bg-white border border-gray-100 rounded-xl p-4 animate-pulse"
                    >
                      <div class="flex justify-between gap-4">
                        <div class="flex-1 space-y-2">
                          <div class="h-4 w-2/3 bg-gray-100 rounded" />
                          <div class="h-3 w-full bg-gray-100 rounded" />
                          <div class="h-3 w-1/2 bg-gray-100 rounded" />
                        </div>
                        <div class="w-8 h-8 rounded-full bg-gray-100" />
                      </div>
                    </div>
                  </div>
                </template>

                <!-- ===================== -->
                <!-- 2️⃣ EMPTY STATE -->
                <!-- ===================== -->
                <template v-else-if="!hasServices">
                  <div
                    class="flex flex-col items-center text-center py-16 px-4"
                  >
                    <div
                      class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                    >
                      <svg
                        class="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>

                    <h3 class="text-lg font-semibold text-gray-900 mb-1">
                      No services available right now
                    </h3>

                    <p class="text-sm text-gray-600 max-w-sm">
                      We’re currently curating the perfect wellness experiences
                      for you. Please check back shortly 🌿
                    </p>

                    <button
                      @click="refetchServices"
                      class="mt-6 px-6 py-3 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition"
                    >
                      Refresh
                    </button>
                  </div>
                </template>

                <!-- ===================== -->
                <!-- 3️⃣ CONTENT STATE -->
                <!-- ===================== -->
                <template v-else>
                  <!-- Sticky Category Tabs -->
                  <div
                    class="sticky top-0 bg-white z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 pb-4"
                  >
                    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      <button
                        v-for="category in serviceCategories"
                        :key="category"
                        @click="scrollToCategory(category)"
                        :class="[
                          'flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-sm transition',
                          activeCategory === category
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
                        ]"
                      >
                        {{ category?.categoryName ?? "All Services" }}
                      </button>
                    </div>
                  </div>

                  <!-- Services by Category -->
                  <div ref="servicesContainerRef" class="space-y-8">
                    <div
                      v-for="category in serviceCategories"
                      :key="category"
                      :ref="(el) => setCategoryRef(category, el)"
                      class="scroll-mt-32"
                    >
                      <h2 class="text-lg font-bold text-gray-900 mb-3">
                        {{ category?.categoryName ?? "Featured" }}
                      </h2>

                      <div class="space-y-3">
                        <div
                          v-for="service in getServicesByCategory(category)"
                          :key="service._id"
                          class="bg-white rounded-xl border-[0.5px] transition cursor-pointer p-3 sm:p-4 active:scale-98"
                          :class="
                            isServiceInCart(service._id)
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-100'
                          "
                          @click="handleServiceClick(service)"
                        >
                          <div class="flex items-start justify-between gap-3">
                            <div class="flex-1 min-w-0">
                              <h3
                                class="font-semibold text-sm sm:text-base mb-1"
                              >
                                {{ service.basicDetails.serviceName }}
                              </h3>

                              <p
                                class="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2"
                              >
                                {{ service.basicDetails.description }}
                              </p>

                              <div
                                class="flex items-center gap-3 text-xs sm:text-sm text-gray-500"
                              >
                                <span>
                                  {{
                                    formatDuration(
                                      service.pricingAndDuration.duration
                                        .servicingTime
                                    )
                                  }}
                                </span>
                                <span class="font-bold text-gray-900">
                                  {{
                                    formatPrice(
                                      service.pricingAndDuration.price
                                    )
                                  }}
                                </span>
                              </div>
                            </div>

                            <button
                              @click.stop="toggleServiceInCart(service)"
                              class="ml-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition flex-shrink-0"
                              :class="
                                isServiceInCart(service._id)
                                  ? 'bg-primary text-white'
                                  : 'border-[0.5px] border-gray-100'
                              "
                            >
                              <svg
                                v-if="isServiceInCart(service._id)"
                                class="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                              <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="#000000"
                                viewBox="0 0 256 256"
                              >
                                <path
                                  d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"
                                ></path>
                              </svg>
                            </button>

                            <!-- <button
                @click.stop="toggleServiceInCart(service)"
                class="ml-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition flex-shrink-0"
                :class="
                  isServiceInCart(service._id)
                    ? 'bg-primary text-white'
                    : 'border-[0.5px] border-gray-100'
                "
              >
              </button> -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Step 2: Date/Time -->
              <div v-show="currentStep === 2">
                <h1
                  class="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2"
                >
                  Select time
                </h1>
                <p class="text-sm text-gray-600 mb-4 sm:mb-6">
                  Choose your preferred date and time
                </p>
                <!-- {{ selectedDate }} -->

                <button
                  @click="showDatePicker = !showDatePicker"
                  class="mb-4 px-3 sm:px-4 py-3 border-[0.5px] border-gray-100 rounded-lg flex items-center gap-2 hover:bg-gray-25 w-full text-sm relative"
                >
                  <svg
                    class="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="truncate">{{
                    formatDisplayDate(selectedDate) || "Select date"
                  }}</span>
                </button>

                <!-- Calendar Picker - Absolute positioned overlay -->
                <div v-if="showDatePicker" class="relative mb-4">
                  <div
                    class="absolute top-0 left-0 right-0 bg-white border-[0.5px] border-gray-50 rounded-lg p-3 sm:p-4 shadow-xl z-50"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <button
                        @click="previousMonth"
                        class="p-2 hover:bg-gray-100 rounded"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <h3 class="font-semibold text-sm">
                        {{ currentMonthYear }}
                      </h3>
                      <button
                        @click="nextMonth"
                        class="p-2 hover:bg-gray-100 rounded"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    <div class="grid grid-cols-7 gap-1 text-center">
                      <div
                        v-for="day in ['M', 'T', 'W', 'T', 'F', 'S', 'S']"
                        :key="day"
                        class="text-[10px] sm:text-xs text-gray-500 font-medium py-1"
                      >
                        {{ day }}
                      </div>
                      <div
                        v-for="date in calendarDates"
                        :key="date.dateString"
                        @click="selectDate(date)"
                        :class="[
                          'py-2 rounded-full cursor-pointer transition text-xs',
                          !date.isCurrentMonth ? 'text-gray-300' : '',
                          date.isToday ? 'font-bold' : '',
                          date.dateString === selectedDate
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100',
                          !date.isAvailable
                            ? 'opacity-50 cursor-not-allowed'
                            : '',
                        ]"
                      >
                        {{ date.day }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Horizontal Quick Date Picker - Fixed spacing -->
                <div class="mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
                  <div
                    class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
                  >
                    <button
                      v-for="day in upcomingDays"
                      :key="day.dateString"
                      @click="selectDateFromQuick(day)"
                      :class="[
                        'flex-shrink-0 snap-start text-center py-2.5 px-3 min-w-[60px] rounded-full border-[0.5px] transition',
                        selectedDate === day.dateString
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-100 hover:border-gray-200',
                      ]"
                    >
                      <div class="text-base font-bold">{{ day.day }}</div>
                      <div
                        class="text-[10px] uppercase tracking-wide"
                        :class="
                          selectedDate === day.dateString
                            ? 'text-white'
                            : 'text-gray-500'
                        "
                      >
                        {{ day.weekday }}
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Time Slots -->
                <div v-if="selectedDate && timeSlots.length > 0">
                  <h3 class="font-semibold mb-3 text-sm">Available times</h3>
                  <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    <button
                      v-for="slot in timeSlots"
                      :key="slot.startTime"
                      @click="selectTimeSlot(slot.startTime)"
                      :class="[
                        'py-2.5 rounded-full text-xs font-medium transition border-[0.5px]',
                        selectedTime === slot.startTime
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white border-gray-100 hover:border-gray-200',
                      ]"
                    >
                      {{ formatTime(slot.startTime) }}
                    </button>
                  </div>
                </div>

                <div
                  v-else-if="selectedDate"
                  class="text-center py-12 bg-gray-50 rounded-lg"
                >
                  <svg
                    class="w-16 h-16 mx-auto mb-3 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p class="text-sm font-medium text-gray-700 mb-1">
                    No available slots
                  </p>
                  <p class="text-xs text-gray-500">
                    Please select a different date
                  </p>
                </div>
                <!-- <div v-else-if="selectedDate" class="text-center py-12 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-500">No available slots</p>
                </div> -->
              </div>

              <!-- Step 3: Confirm -->
              <div v-show="currentStep === 3" class="space-y-4">
                <h1 class="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                  Review and confirm
                </h1>
                <p class="text-sm text-gray-600 mb-4">
                  Please review your booking details
                </p>

                <div>
                  <h3 class="font-semibold mb-2 text-sm">Payment method</h3>
                  <div
                    class="border-[0.5px] border-gray-100 rounded-lg p-5 flex items-center gap-2"
                  >
                    <img
                      src="@/assets/img/paystack-logo.png"
                      class="h-6 w-auto"
                      alt=""
                    />
                    <!-- <span class="font-medium text-sm">Pay with Paystack</span> -->
                  </div>
                </div>

                <div
                  class="p-3 bg-gray-25 border-[0.5px] border-gray-50 rounded-lg"
                >
                  <h3 class="font-semibold mb-1 text-sm">
                    Cancellation policy
                  </h3>
                  <p class="text-xs text-gray-700">
                    Cancel at least <strong>2 hours before</strong> appointment.
                  </p>
                </div>

                <div>
                  <h3 class="font-semibold mb-1 text-sm">Important info</h3>
                  <p class="text-xs text-gray-600 leading-relaxed">
                    Appointments confirmed upon payment. Unconfirmed
                    appointments released after 2 hours.
                  </p>
                </div>

                <div>
                  <UiAnimatedInput
                    v-model="bookingNotes"
                    label="Booking notes (optional)"
                    type="textarea"
                    :rows="3"
                    :cols="6"
                  />
                </div>
              </div>
            </div>

            <!-- Desktop Sidebar - Fixed position, doesn't scroll with content -->
            <div class="hidden lg:block lg:col-span-1">
              <div
                class="sticky top-24 bg-white border-[0.5px] border-gray-50 rounded-lg h-[calc(100vh-12rem)] flex flex-col"
              >
                <!-- Business Info - Fixed -->
                <div
                  class="flex items-center gap-3 p-6 pb-4 border-b-[0.5px] border-gray-50 flex-shrink-0"
                >
                  <div
                    class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"
                  >
                    <img
                      v-if="business?.logo"
                      :src="business?.logo"
                      class="w-12 h-12 rounded-lg object-cover"
                      alt="Logo"
                    />
                    <span v-else class="text-gray-500 font-bold">{{
                      business?.businessName?.charAt(0)
                    }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-sm truncate">
                      {{ business?.businessName }}
                    </h3>
                    <p class="text-xs text-gray-500 truncate">
                      {{ business?.address?.street }}
                    </p>
                  </div>
                </div>

                <!-- Scrollable Cart Content -->
                <div class="flex-1 overflow-y-auto px-6 py-4">
                  <!-- <div v-if="cart.length === 0" class="text-center py-8 text-gray-400">
                    <p class="text-sm">No services selected</p>
                  </div> -->
                  <div v-if="cart.length === 0" class="text-center py-8">
                    <svg
                      class="w-12 h-12 mx-auto mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <p class="text-sm text-gray-500">No services selected</p>
                  </div>

                  <div v-else class="space-y-4">
                    <div
                      v-if="selectedDate"
                      class="text-sm space-y-1 pb-4 border-b-[0.5px] border-gray-50"
                    >
                      <div class="flex items-center gap-2 text-gray-600">
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span class="text-xs">{{
                          formatDisplayDate(selectedDate)
                        }}</span>
                      </div>
                      <div
                        v-if="selectedTime"
                        class="flex items-center gap-2 text-gray-600"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span class="text-xs">{{
                          formatTime(selectedTime)
                        }}</span>
                      </div>
                    </div>

                    <div
                      v-for="item in cart"
                      :key="item.service._id"
                      class="border-t-[0.5px] first:border-t-0 border-gray-50 pt-4"
                    >
                      <div class="flex justify-between items-start mb-1">
                        <h4 class="font-medium text-sm flex-1">
                          {{ item.service.basicDetails.serviceName }}
                        </h4>
                        <button
                          @click="removeFromCart(item.service._id)"
                          class="text-gray-400 bg-gray-50 rounded-full p-2 hover:text-red-500 ml-2 flex-shrink-0"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div class="text-xs text-gray-500 mb-2">
                        {{
                          formatDuration(
                            item.service.pricingAndDuration.duration
                              .servicingTime
                          )
                        }}
                      </div>
                      <div class="font-semibold text-sm">
                        {{
                          formatPrice(
                            item.selectedVariant?.price ||
                              item.service.pricingAndDuration.price
                          )
                        }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Total & CTA - Fixed at bottom -->
                <div
                  v-if="cart.length > 0"
                  class="border-t-[0.5px] border-gray-100 p-6 flex-shrink-0"
                >
                  <div class="flex justify-between items-center mb-4">
                    <span class="font-semibold text-base">Total</span>
                    <span class="font-semibold text-base">{{
                      formatPrice(totalPrice)
                    }}</span>
                  </div>

                  <button
                    v-if="currentStep === 1"
                    @click="proceedToDateTime"
                    :disabled="cart.length === 0"
                    class="w-full bg-gray-900 text-white text-sm font-bold py-3.5 rounded-full transition disabled:opacity-50 hover:bg-gray-800"
                  >
                    Continue
                  </button>

                  <button
                    v-else-if="currentStep === 2"
                    @click="proceedToConfirm"
                    :disabled="!selectedDate || !selectedTime"
                    class="w-full bg-gray-900 text-white text-sm font-bold py-3.5 rounded-full transition disabled:opacity-50 hover:bg-gray-800"
                  >
                    Continue
                  </button>

                  <button
                    v-else-if="currentStep === 3"
                    @click="confirmBooking"
                    class="w-full bg-gray-900 text-white text-sm font-bold py-3.5 rounded-full transition disabled:opacity-50 hover:bg-gray-800"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Bottom Bar -->
      <div
        class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-[0.5px] border-gray-50 z-20 safe-area-bottom"
      >
        <div class="p-4">
          <div
            v-if="cart.length > 0"
            class="flex items-center justify-between gap-4"
          >
            <div class="flex-1 min-w-0">
              <div class="text-xs text-gray-600">
                {{ cart.length }} service{{ cart.length > 1 ? "s" : "" }}
              </div>
              <div class="font-bold text-lg truncate">
                {{ formatPrice(totalPrice) }}
              </div>
            </div>
            <button
              v-if="currentStep === 1"
              @click="proceedToDateTime"
              :disabled="cart.length === 0"
              class="px-6 py-3 bg-gray-900 text-white font-semibold rounded-full transition disabled:opacity-50 text-sm whitespace-nowrap"
            >
              Continue
            </button>
            <button
              v-else-if="currentStep === 2"
              @click="proceedToConfirm"
              :disabled="!selectedDate || !selectedTime"
              class="px-6 py-3 bg-gray-900 text-white font-semibold rounded-full transition disabled:opacity-50 text-sm whitespace-nowrap"
            >
              Continue
            </button>
            <button
              v-else-if="currentStep === 3"
              @click="confirmBooking"
              class="px-6 py-3 bg-gray-900 text-white font-semibold rounded-full transition disabled:opacity-50 text-sm whitespace-nowrap"
            >
              Confirm
            </button>
          </div>
          <div v-else class="text-center text-sm text-gray-500 py-2">
            No services selected
          </div>
        </div>
      </div>

      <!-- Service Variant Modal -->
      <Teleport to="body" v-if="showVariantModal && selectedServiceForVariant">
        <div
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
        >
          <div
            class="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <div
              class="sticky top-0 bg-white border-b p-6 flex items-center justify-between"
            >
              <h2 class="text-xl font-bold">
                {{ selectedServiceForVariant.basicDetails.serviceName }}
              </h2>
              <button
                @click="closeVariantModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="p-6">
              <p class="text-gray-600 text-sm mb-6">
                {{ selectedServiceForVariant.basicDetails.description }}
              </p>

              <h3 class="font-semibold mb-4">Select an option *</h3>

              <div class="space-y-3">
                <div
                  v-for="variant in selectedServiceForVariant.pricingAndDuration
                    .variants"
                  :key="variant.name"
                  @click="selectVariant(variant)"
                  :class="[
                    'p-4 border-2 rounded-lg cursor-pointer transition',
                    selectedVariant?.name === variant.name
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300',
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <h4 class="font-medium mb-1">{{ variant.name }}</h4>
                      <p class="text-sm text-gray-500">
                        {{ formatDuration(variant.duration.servicingTime) }}
                      </p>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="font-bold">{{
                        formatPrice(variant.price)
                      }}</span>
                      <div
                        :class="[
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                          selectedVariant?.name === variant.name
                            ? 'border-primary bg-primary'
                            : 'border-gray-300',
                        ]"
                      >
                        <svg
                          v-if="selectedVariant?.name === variant.name"
                          class="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 pt-6 border-t-[0.5px] border-gray-100">
                <div class="flex items-center justify-between mb-4">
                  <span class="font-bold">
                    {{
                      selectedVariant
                        ? formatPrice(selectedVariant.price)
                        : formatPrice(
                            selectedServiceForVariant.pricingAndDuration.price
                          )
                    }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{
                      selectedVariant
                        ? formatDuration(selectedVariant.duration.servicingTime)
                        : formatDuration(
                            selectedServiceForVariant.pricingAndDuration
                              .duration.servicingTime
                          )
                    }}
                  </span>
                </div>

                <button
                  @click="addVariantServiceToCart"
                  :disabled="
                    !selectedVariant &&
                    selectedServiceForVariant.pricingAndDuration.variants
                      ?.length > 0
                  "
                  class="w-full bg-gray-900 text-white font-bold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
                >
                  Add to booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Add Extra Service Modal -->
      <Teleport to="body" v-if="showExtraServiceModal">
        <div
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center backdrop-blur-sm justify-center z-[60] p-4"
        >
          <div
            class="bg-white rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col"
          >
            <div
              class="p-4 sm:p-6 border-b-[0.5px] border-gray-100 flex items-center justify-between flex-shrink-0"
            >
              <h2 class="text-base sm:text-lg font-bold">
                Add an extra service?
              </h2>
              <button
                @click="skipExtraService"
                class="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
              <div
                v-for="service in availableExtraServices"
                :key="service._id"
                @click="addExtraService(service)"
                class="p-3.5 border-[0.5px] border-gray-100 rounded-xl hover:border-primary hover:bg-primary/5 cursor-pointer transition active:scale-[0.98]"
              >
                <h3 class="font-semibold text-sm mb-0.5">
                  {{ service.basicDetails.serviceName }}
                </h3>
                <div class="flex items-center justify-between gap-3 mt-1.5">
                  <span class="text-xs text-gray-500">{{
                    formatDuration(
                      service.pricingAndDuration.duration.servicingTime
                    )
                  }}</span>
                  <span class="font-bold text-sm">{{
                    formatPrice(service.pricingAndDuration.price)
                  }}</span>
                </div>
              </div>
            </div>

            <div
              class="p-4 sm:p-6 pt-4 border-t-[0.5px] border-gray-100 flex-shrink-0"
            >
              <button
                @click="skipExtraService"
                class="w-full py-3 text-sm rounded-full bg-black text-white font-semibold transition hover:bg-gray-800 active:scale-[0.98]"
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Auth Modal -->
      <Teleport to="body" v-if="showAuthModal">
        <div
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
        >
          <div class="bg-white rounded-2xl max-w-md w-full">
            <div class="p-6">
              <div class="pb-4">
                <h2 class="text-xl font-bold mb-1">Log in or sign up</h2>
                <p class="text-gray-600 text-sm mb-6">
                  Log in or sign up to complete your booking
                </p>
              </div>

              <!-- Tab Navigation -->
              <div class="flex gap-4 mb-6 border-b-[0.5px] border-gray-100">
                <button
                  @click="authTab = 'login'"
                  :class="[
                    'pb-2 w-full font-semibold transition',
                    authTab === 'login'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-800',
                  ]"
                >
                  Login
                </button>
                <button
                  @click="authTab = 'signup'"
                  :class="[
                    'pb-2 w-full font-semibold transition',
                    authTab === 'signup'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-800',
                  ]"
                >
                  Sign Up
                </button>
              </div>

              <!-- Login Form -->
              <form
                v-if="authTab === 'login'"
                @submit.prevent="handleLogin"
                class="space-y-4"
              >
                <div>
                  <UiAnimatedInput
                    v-model="loginForm.email"
                    type="email"
                    label="Email"
                    required
                  />
                </div>
                <div>
                  <UiAnimatedInput
                    v-model="loginForm.password"
                    type="password"
                    label="Password"
                    required
                  />
                </div>
                <div v-if="loginError" class="text-red-500 text-sm">
                  {{ loginError }}
                </div>
                <div class="pt-6">
                  <button
                    type="submit"
                    class="w-full bg-primary text-sm text-white font-bold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
                  >
                    Continue
                  </button>
                </div>
              </form>

              <!-- Signup Form -->
              <form v-else @submit.prevent="handleSignup" class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <UiAnimatedInput
                      v-model="signupForm.firstName"
                      type="text"
                      label="First Name"
                      required
                    />
                  </div>
                  <div>
                    <UiAnimatedInput
                      v-model="signupForm.lastName"
                      label="Last Name"
                      type="text"
                      required
                    />
                  </div>
                </div>
                <div>
                  <UiAnimatedInput
                    v-model="signupForm.email"
                    type="email"
                    required
                    label="Email"
                  />
                </div>
                <div>
                  <UiAnimatedInput
                    v-model="signupForm.phone"
                    type="tel"
                    label="Phone Number"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-1 text-sm"
                    >Password</label
                  >
                  <UiAnimatedInput
                    v-model="signupForm.password"
                    type="password"
                    label="Password"
                    required
                    minlength="6"
                  />
                  <p class="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
                </div>
                <div v-if="signupError" class="text-red-500 text-sm">
                  {{ signupError }}
                </div>
                <div class="pt-6">
                  <button
                    type="submit"
                    class="w-full bg-primary text-sm text-white font-bold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
                  >
                    Continue
                  </button>
                </div>
              </form>

              <!-- Divider -->
              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500"
                    >Or continue with</span
                  >
                </div>
              </div>

              <!-- Google Sign In -->
              <button
                type="button"
                @click="handleGoogleAuth"
                :disabled="googleAuthLoading"
                class="w-full disabled:cursor-not-allowed disabled:opacity-25 flex items-center justify-center gap-3 bg-white border-[0.5px] border-gray-100 hover:border-gray-100 text-gray-700 font-semibold py-3 rounded-full transition-all"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {{
                  googleAuthLoading ? "processing.." : "Continue with Google"
                }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { useRoute } from "vue-router";
import { useGetBusiness } from "@/composables/modules/business/useGetBusiness";
import { useGetServices } from "@/composables/modules/services/useGetServices";
import { useGetAvailableSlots } from "@/composables/modules/availability/useGetAvailableSlots";
import { useGetAllSlots } from "@/composables/modules/availability/useGetAllSlots";
import { useCreateBooking } from "@/composables/modules/booking/useCreateBooking";
import { useInitializePayment } from "@/composables/modules/payment/useInitializePayment";
import { useLogin } from "@/composables/modules/auth/useLogin";
import { useRegister } from "@/composables/modules/auth/useRegister";
import { useGoogleAuth } from "@/composables/modules/auth/useGoogleAuth";
// bookingNotes
// Props
const props = defineProps<{
  isOpen: boolean;
}>();

// Emits
const emit = defineEmits(["close", "success"]);

// Route
const route = useRoute();

// Composables
const { business } = useGetBusiness();
const { services, getServices, loading: isLoadingServices } = useGetServices();
const { slots: availableSlots, getAvailableSlots } = useGetAvailableSlots();
// const { getAllSlots } = useGetAllSlots();
const { createBooking } = useCreateBooking();
const { initializePayment } = useInitializePayment();
const { login, error: loginError } = useLogin();
const { register, error: signupError } = useRegister();
const { loginWithGoogle, loading: googleAuthLoading } = useGoogleAuth();

// State
const currentStep = ref(1);
const selectedCategory = ref("Featured");
const activeCategory = ref("Featured");
const cart = ref<Array<{ service: any; selectedVariant?: any }>>([]);
const selectedDate = ref<string | null>(null);
const selectedTime = ref<string | null>(null);
const bookingNotes = ref("");

// Service variant modal
const showVariantModal = ref(false);
const selectedServiceForVariant = ref<any>(null);
const selectedVariant = ref<any>(null);

// Extra service modal
const showExtraServiceModal = ref(false);

// Auth modal
const showAuthModal = ref(false);
const authTab = ref<"login" | "signup">("login");
const isAuthenticated = ref(false);
const currentUser = ref<any>(null);

// Auth forms
const loginForm = reactive({
  email: "",
  password: "",
});

const signupForm = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "client",
});

// Calendar state
const showDatePicker = ref(false);
const calendarMonth = ref(new Date().getMonth());
const calendarYear = ref(new Date().getFullYear());

// Category refs for scroll tracking
const categoryRefs = ref<Record<string, HTMLElement>>({});
const servicesContainerRef = ref<HTMLElement | null>(null);
const leftContentRef = ref<HTMLElement | null>(null);
const scrollObserver = ref<IntersectionObserver | null>(null);
const isUserScrolling = ref(false);
let scrollTimeout: NodeJS.Timeout | null = null;

// Computed
const serviceCategories = computed(() => {
  const categories = new Set(["Featured"]);
  services.value?.forEach((service: any) => {
    if (service.basicDetails.category) {
      categories.add(service.basicDetails.category);
    }
  });
  return Array.from(categories);
});

const hasServices = computed(() => serviceCategories.value.length > 0);

const getServicesByCategory = (category: string) => {
  if (category === "Featured") {
    return services.value;
  }
  return (
    services.value?.filter((s: any) => s.basicDetails.category === category) ||
    []
  );
};

const handleGoogleAuth = async () => {
  await loginWithGoogle().then((response) => {
    if (response?.data.success) {
      checkUserAuthentication();
      showAuthModal.value = false;
      currentStep.value = 3;
      loginForm.email = "";
      loginForm.password = "";
    }
  })
};

const timeSlots = computed(() => {
  if (!availableSlots.value) return [];
  return availableSlots.value.filter((slot: any) => slot.isBookable !== false);
});

const totalPrice = computed(() => {
  let total = { amount: 0, currency: "NGN" };
  cart.value.forEach((item) => {
    const price =
      item.selectedVariant?.price || item.service.pricingAndDuration.price;
    total.amount += price.amount;
    total.currency = price.currency;
  });
  return total;
});

const availableExtraServices = computed(() => {
  return (
    services.value?.filter(
      (s: any) => !cart.value.some((item) => item.service._id === s._id)
    ) || []
  );
});

const currentMonthYear = computed(() => {
  const date = new Date(calendarYear.value, calendarMonth.value);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
});

const calendarDates = computed(() => {
  const dates = [];
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1);
  const lastDay = new Date(calendarYear.value, calendarMonth.value + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dayOfWeek = firstDay.getDay();
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const prevMonthLastDay = new Date(
    calendarYear.value,
    calendarMonth.value,
    0
  ).getDate();
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    dates.push({
      day: prevMonthLastDay - i,
      dateString: "",
      isCurrentMonth: false,
      isToday: false,
      isAvailable: false,
    });
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(calendarYear.value, calendarMonth.value, i);
    const dateString = date.toISOString().split("T")[0];
    const isToday = date.getTime() === today.getTime();
    const isPast = date < today;

    dates.push({
      day: i,
      dateString,
      isCurrentMonth: true,
      isToday,
      isAvailable: !isPast,
    });
  }

  const remainingDays = 42 - dates.length;
  for (let i = 1; i <= remainingDays; i++) {
    dates.push({
      day: i,
      dateString: "",
      isCurrentMonth: false,
      isToday: false,
      isAvailable: false,
    });
  }

  return dates;
});

const upcomingDays = computed(() => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    days.push({
      day: date.getDate(),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      dateString: date.toISOString().split("T")[0],
    });
  }

  return days;
});

// Methods
const setCategoryRef = (category: string, el: any) => {
  if (el) {
    categoryRefs.value[category] = el;
  }
};

const setupScrollObserver = () => {
  if (scrollObserver.value) {
    scrollObserver.value.disconnect();
  }

  const observerOptions = {
    root: leftContentRef.value,
    threshold: [0, 0.25, 0.5, 0.75, 1],
    rootMargin: "-20% 0px -70% 0px",
  };

  scrollObserver.value = new IntersectionObserver((entries) => {
    if (isUserScrolling.value) return;

    let maxRatio = 0;
    let visibleCategory = activeCategory.value;

    entries.forEach((entry) => {
      if (entry.intersectionRatio > maxRatio) {
        maxRatio = entry.intersectionRatio;
        const category = entry.target.getAttribute("data-category");
        if (category) {
          visibleCategory = category;
        }
      }
    });

    if (maxRatio > 0) {
      activeCategory.value = visibleCategory;
    }
  }, observerOptions);

  Object.values(categoryRefs.value).forEach((ref) => {
    if (ref) {
      scrollObserver.value?.observe(ref);
    }
  });

  // Track manual scrolling
  if (leftContentRef.value) {
    leftContentRef.value.addEventListener("scroll", handleScroll);
  }
};

const handleScroll = () => {
  isUserScrolling.value = true;

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(() => {
    isUserScrolling.value = false;
  }, 150);
};

const scrollToCategory = (category: string) => {
  isUserScrolling.value = true;
  activeCategory.value = category;

  const element = categoryRefs.value[category];
  if (element && leftContentRef.value) {
    const container = leftContentRef.value;
    const elementTop = element.offsetTop;
    const containerTop = container.scrollTop;
    const offset = 100; // Offset for sticky header

    container.scrollTo({
      top: elementTop - offset,
      behavior: "smooth",
    });

    setTimeout(() => {
      isUserScrolling.value = false;
    }, 1000);
  }
};

const closeModal = () => {
  emit("close");
};

const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const isServiceInCart = (serviceId: string) => {
  return cart.value.some((item) => item.service._id === serviceId);
};

const handleServiceClick = (service: any) => {
  if (
    service.pricingAndDuration.variants &&
    service.pricingAndDuration.variants.length > 0
  ) {
    selectedServiceForVariant.value = service;
    selectedVariant.value = null;
    showVariantModal.value = true;
  } else {
    toggleServiceInCart(service);
  }
};

const toggleServiceInCart = (service: any) => {
  const index = cart.value.findIndex(
    (item) => item.service._id === service._id
  );
  if (index > -1) {
    cart.value.splice(index, 1);
  } else {
    cart.value.push({ service });
  }
};

const removeFromCart = (serviceId: string) => {
  const index = cart.value.findIndex((item) => item.service._id === serviceId);
  if (index > -1) {
    cart.value.splice(index, 1);
  }
};

const selectVariant = (variant: any) => {
  selectedVariant.value = variant;
};

const addVariantServiceToCart = () => {
  if (selectedServiceForVariant.value) {
    cart.value.push({
      service: selectedServiceForVariant.value,
      selectedVariant: selectedVariant.value,
    });
    closeVariantModal();
  }
};

const closeVariantModal = () => {
  showVariantModal.value = false;
  selectedServiceForVariant.value = null;
  selectedVariant.value = null;
};

// const proceedToDateTime = () => {
//   if (cart.value.length > 0) {
//     currentStep.value = 2
//   }
// }

// const proceedToDateTime = async () => {
//   if (cart.value.length > 0) {
//     currentStep.value = 2

//     // Auto-select today's date if none selected
//     if (!selectedDate.value) {
//       const today = new Date()
//       selectedDate.value = today.toISOString().split('T')[0]
//       await fetchTimeSlots()
//     }
//   }
// }

// const proceedToDateTime = async () => {
//   if (cart.value.length > 0) {
//     // Auto-select today's date if none selected
//     if (!selectedDate.value) {
//       const today = new Date()
//       selectedDate.value = today.toISOString().split('T')[0]
//     }

//     currentStep.value = 2

//     // Fetch time slots after step changes
//     await nextTick()
//     await fetchTimeSlots()
//   }
// }

const proceedToDateTime = async () => {
  if (cart.value.length === 0) return;

  // Set today's date if not already set
  if (!selectedDate.value) {
    const today = new Date();
    selectedDate.value = today.toISOString().split("T")[0];
  }

  // Reset selected time
  selectedTime.value = null;

  // Change step
  currentStep.value = 2;

  // Wait for DOM to update
  await nextTick();

  // Fetch slots immediately
  if (business.value && selectedDate.value) {
    console.log("Fetching slots for:", selectedDate.value); // Debug log
    await fetchTimeSlots();
  }
};

const previousMonth = () => {
  if (calendarMonth.value === 0) {
    calendarMonth.value = 11;
    calendarYear.value--;
  } else {
    calendarMonth.value--;
  }
};

const nextMonth = () => {
  if (calendarMonth.value === 11) {
    calendarMonth.value = 0;
    calendarYear.value++;
  } else {
    calendarMonth.value++;
  }
};

const selectDate = (date: any) => {
  if (date.isCurrentMonth && date.isAvailable) {
    selectedDate.value = date.dateString;
    selectedTime.value = null;
    showDatePicker.value = false;
    fetchTimeSlots();
  }
};

const selectDateFromQuick = (day: any) => {
  selectedDate.value = day.dateString;
  selectedTime.value = null;
  showDatePicker.value = false;
  fetchTimeSlots();
};

const selectTimeSlot = (time: string) => {
  selectedTime.value = time;
};

// const fetchTimeSlots = async () => {
//   if (!selectedDate.value || !business.value) return

//   const serviceIds = cart.value.map(item => item.service._id)

//   await getAvailableSlots({
//     subdomain: route.query.subdomain as string,
//     date: selectedDate.value,
//     serviceIds
//   })
// }

const fetchTimeSlots = async () => {
  console.log("Fetching time slots...", business.value); // Debug log
  console.log("Selected date:", selectedDate.value); // Debug log
  console.log("Cart contents:", cart.value); // Debug log
  if (!selectedDate.value || !business.value || cart.value.length === 0) {
    console.log("Missing required data for fetching slots"); // Debug
    return;
  }

  const serviceIds = cart.value.map((item) => item.service._id);

  console.log("Fetching slots with:", {
    subdomain: route.query.subdomain,
    date: selectedDate.value,
    serviceIds,
  }); // Debug log

  try {
    await getAvailableSlots({
      subdomain: route.query.subdomain as string,
      date: selectedDate.value,
      serviceIds,
    });
    console.log("Slots fetched:", availableSlots.value); // Debug log
  } catch (error) {
    console.error("Error fetching slots:", error);
  }
};

const proceedToConfirm = () => {
  if (selectedDate.value && selectedTime.value) {
    if (cart.value.length === 1 && availableExtraServices.value.length > 0) {
      showExtraServiceModal.value = true;
    } else {
      checkAuthAndProceed();
    }
  }
};

const addExtraService = (service: any) => {
  if (
    service.pricingAndDuration.variants &&
    service.pricingAndDuration.variants.length > 0
  ) {
    showExtraServiceModal.value = false;
    selectedServiceForVariant.value = service;
    selectedVariant.value = null;
    showVariantModal.value = true;
  } else {
    cart.value.push({ service });
    showExtraServiceModal.value = false;
    checkAuthAndProceed();
  }
};

const skipExtraService = () => {
  showExtraServiceModal.value = false;
  checkAuthAndProceed();
};

const checkAuthAndProceed = () => {
  checkUserAuthentication();
  if (!isAuthenticated.value) {
    showAuthModal.value = true;
  } else {
    currentStep.value = 3;
  }
};

const checkUserAuthentication = () => {
  try {
    const userDataStr = localStorage.getItem("user");
    const user = userDataStr ? JSON.parse(userDataStr) : null;

    if (user && user.id) {
      currentUser.value = user;
      isAuthenticated.value = true;
    } else {
      isAuthenticated.value = false;
    }
  } catch (err) {
    console.error("Error checking authentication:", err);
    isAuthenticated.value = false;
  }
};

const handleLogin = async () => {
  try {
    const success = await login({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (success) {
      checkUserAuthentication();
      showAuthModal.value = false;
      currentStep.value = 3;
      loginForm.email = "";
      loginForm.password = "";
    }
  } catch (err) {
    console.error("Login error:", err);
  }
};

const handleSignup = async () => {
  try {
    const result = await register({
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      email: signupForm.email,
      phone: signupForm.phone,
      password: signupForm.password,
      role: signupForm.role,
    });

    if (result) {
      const loginSuccess = await login({
        email: signupForm.email,
        password: signupForm.password,
      });

      if (loginSuccess) {
        checkUserAuthentication();
        showAuthModal.value = false;
        currentStep.value = 3;
        signupForm.firstName = "";
        signupForm.lastName = "";
        signupForm.email = "";
        signupForm.phone = "";
        signupForm.password = "";
      }
    }
  } catch (err) {
    console.error("Signup error:", err);
  }
};

watch(
  selectedDate,
  async (newDate) => {
    console.log("Selected date changed to:", newDate); // Debug log
    if (newDate) {
      selectedTime.value = null;
      await fetchTimeSlots();
    }
  },
  { immediate: true }
);

const confirmBooking = async () => {
  if (!business.value || !selectedDate.value || !selectedTime.value) return;

  try {
    const payload = {
  businessId: business.value._id,
  clientId: currentUser.value?.id,
  bookingNotes: bookingNotes.value,
  clientName: `${currentUser.value?.firstName || ""} ${
    currentUser.value?.lastName || ""
  }`.trim(),
  clientEmail: currentUser.value?.email || "",
  preferredDate: selectedDate.value,
  preferredStartTime: selectedTime.value,
  services: cart.value.map((item: any) => ({
    serviceId: item.service._id,
    bufferTime: 0,
  })),
  bookingSource: {
    sourceType: route.query.source || "direct_link",
    sourceIdentifier: `BOOKING-WEB-${Date.now()}`,
    channel: "web",
    ipAddress: "N/A",
    userAgent: navigator.userAgent,
  },
  notes: bookingNotes.value,

  // 👇 only included if phone is a non-empty string
  ...(currentUser.value?.phone?.trim()
    ? { clientPhone: currentUser.value.phone }
    : {}),
};

    // const payload = {
    //   businessId: business.value._id,
    //   clientId: currentUser.value?.id,
    //   bookingNotes: bookingNotes.value,
    //   clientName: `${currentUser.value?.firstName || ""} ${
    //     currentUser.value?.lastName || ""
    //   }`.trim(),
    //   clientEmail: currentUser.value?.email || "",
    //   clientPhone: currentUser.value?.phone || "",
    //   preferredDate: selectedDate.value,
    //   preferredStartTime: selectedTime.value,
    //   services: cart.value.map((item) => ({
    //     serviceId: item.service._id,
    //     bufferTime: 0,
    //   })),
    //   bookingSource: {
    //     sourceType: route.query.source || "direct_link",
    //     sourceIdentifier: `BOOKING-WEB-${Date.now()}`,
    //     channel: "web",
    //     ipAddress: "N/A",
    //     userAgent: navigator.userAgent,
    //   },
    //   notes: bookingNotes.value,
    // };

    const data = await createBooking(payload);

    const paymentPayload = {
      email: currentUser.value?.email || "",
      amount: totalPrice.value.amount,
      bookingId: data.bookingId,
      clientId: currentUser.value?.id || "guest",
      subdomain: route.query.subdomain as string,
    };

    const paymentRes: any = await initializePayment(paymentPayload);

    if (paymentRes && paymentRes.authorization_url) {
      window.location.href = paymentRes.authorization_url;
    }
  } catch (err) {
    console.error("Booking error:", err);
  }
};

// Utility functions
const formatPrice = (price: any) => {
  if (!price) return "";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: price.currency || "NGN",
  }).format(price.amount || 0);
};

const formatDuration = (duration: any) => {
  if (!duration) return "";
  return `${duration.value} ${duration.unit}`;
};

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDisplayDate = (dateString: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

// Watch for modal open
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      if (
        route.query.subdomain &&
        (!services.value || services.value.length === 0)
      ) {
        getServices(route.query.subdomain as string);
      }
    }
  },
  { immediate: true }
);

// Setup scroll observer when step 1 is active
watch(
  [() => currentStep.value, () => services.value],
  async ([step, servs]) => {
    if (step === 1 && servs && servs.length > 0) {
      await nextTick();
      setupScrollObserver();
    }
  }
);

// watch(() => currentStep.value, async (newStep) => {
//   if (newStep === 2 && !selectedDate.value) {
//     // Auto-select today when moving to date/time step
//     const today = new Date()
//     selectedDate.value = today.toISOString().split('T')[0]

//     if (cart.value.length > 0 && business.value) {
//       await fetchTimeSlots()
//     }
//   }
// }, { immediate: true })

// watch(() => currentStep.value, async (newStep) => {
//   if (newStep === 2 && cart.value.length > 0 && selectedDate.value) {
//     selectedTime.value = null
//     await fetchTimeSlots()
//   }
// }, { immediate: true })

// Initialize
onMounted(() => {
  checkUserAuthentication();

  // // Auto-select today's date and fetch slots
  // if (currentStep.value === 2 || props.isOpen) {
  //   const today = new Date()
  //   selectedDate.value = today.toISOString().split('T')[0]

  //   // Fetch slots for today if we have services in cart
  //   if (cart.value.length > 0 && business.value) {
  //     fetchTimeSlots()
  //   }
  // }
});

onUnmounted(() => {
  if (scrollObserver.value) {
    scrollObserver.value.disconnect();
  }
  if (leftContentRef.value) {
    leftContentRef.value.removeEventListener("scroll", handleScroll);
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.active\:scale-98:active {
  transform: scale(0.98);
}

.overscroll-contain {
  overscroll-behavior: contain;
}

.scroll-mt-32 {
  scroll-margin-top: 8rem;
}

.snap-x {
  scroll-snap-type: x mandatory;
}

.snap-start {
  scroll-snap-align: start;
}

@media (max-width: 640px) {
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
