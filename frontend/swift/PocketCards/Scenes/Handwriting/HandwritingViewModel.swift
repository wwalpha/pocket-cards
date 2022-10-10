

//  DailyStudyViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class HandwritingViewModel: ObservableObject {
    @Published var isInitialized = false
    @Published var isCorrect = false
    @Published var isLoading = false

    var question: Question?
}
