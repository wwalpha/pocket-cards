//
//  DailyStudyViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class DailyStudyViewModel: ObservableObject {
    @Published var isShowError: String = ""
    @Published var isLoading = false
    @Published var isFinish = false

    var question: Question?
}
