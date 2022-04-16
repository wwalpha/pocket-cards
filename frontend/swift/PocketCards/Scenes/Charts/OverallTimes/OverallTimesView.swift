//
//  OverallTimesView.swift
//  PocketCards
//
//  Created by macmini on 2022/04/11.
//
//

import SwiftUI

struct OverallTimesView: View {
    var interactor: OverallTimesBusinessLogic?

    @ObservedObject var viewModel = OverallTimesViewModel()

    var body: some View {
        Text("Hello")
    }
}

extension OverallTimesView: OverallTimesDisplayLogic {}

extension OverallTimesView {
    func configureView() -> some View {
        var view = self
        let interactor = OverallTimesInteractor()
        let presenter = OverallTimesPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct OverallTimesView_Previews: PreviewProvider {
    static var previews: some View {
        OverallTimesView()
    }
}
