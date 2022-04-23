//
//  ChartsViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//
//

import SwiftUI

class DailyTasksViewModel: ObservableObject {
    @Published var lanArchive: Double = 0
    @Published var lanTarget: Double = 0
    @Published var socArchive: Double = 0
    @Published var socTarget: Double = 0
    @Published var sciArchive: Double = 0
    @Published var sciTarget: Double = 0
    @Published var isLoaded = false
}
