//
//  DailyPracticeViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/11/16.
//
//

import SwiftUI

class DailyPracticeViewModel: ObservableObject {
    @Published var status = ScreenStatus.INITIALIZE
    @Published var isShowError: String = ""

    var question: Question?
    var mode: String = ""
    var subject: String = ""
}
