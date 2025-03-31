//
//  DailyStatusViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//
//

import SwiftUI

class DailyStatusViewModel: ObservableObject {
    @Published var lanTarget: Double = 0
    @Published var lanTest: Double = 0
    @Published var lanUnlearned: Double = 0
    @Published var lanRelearning: Double = 0
    @Published var socTarget: Double = 0
    @Published var socTest: Double = 0
    @Published var socUnlearned: Double = 0
    @Published var socRelearning: Double = 0
    @Published var sciTarget: Double = 0
    @Published var sciTest: Double = 0
    @Published var sciUnlearned: Double = 0
    @Published var sciRelearning: Double = 0
    @Published var mathsArchive: Double = 0
    @Published var mathsTarget: Double = 0
    @Published var isLoaded = false
}
