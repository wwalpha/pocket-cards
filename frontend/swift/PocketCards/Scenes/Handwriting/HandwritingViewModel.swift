

//  DailyStudyViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class HandwritingViewModel: ObservableObject {
    @Published var isInitialized = false

    var question: Question?
}
