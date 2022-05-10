//
//  DailyStudyViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/03/09.
//

import SwiftUI

class DailyTestViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var isFinish = false

    var question: Question?
}
